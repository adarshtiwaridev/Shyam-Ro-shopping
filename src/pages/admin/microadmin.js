"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";

export default function MicroAdminManagement() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [deleteUser, setDeleteUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/getusers?role=microadmin");
        const data = await res.json();
        if (res.ok && data.users) {
          setCustomers(
            data.users
              .filter((u) => u.role === "microadmin")
              .map((u) => ({
                id: u._id,
                name: `${u.firstName} ${u.lastName}`,
                email: u.email,
                mobile: u.mobile,
                role: u.role,
              }))
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchValue);
  };

  const handleDelete = (id) => {
    const user = customers.find((c) => c.id === id);
    setDeleteUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteUser) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/deleteuser?id=${deleteUser.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c.id !== deleteUser.id));
        toast.success("Microadmin deleted successfully");
        setShowDeleteModal(false);
        setDeleteUser(null);
      } else {
        toast.error("Failed to delete microadmin");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-950 py-10 px-2 sm:px-6 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <h2 className="text-3xl font-extrabold text-blue-700 dark:text-cyan-300 mb-8 text-center tracking-tight">
        Microadmin Management
      </h2>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-6"
      >
        <Input
          type="text"
          placeholder="Search by user name..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full max-w-xs border border-blue-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-cyan-700 dark:to-blue-800 text-white font-semibold shadow hover:from-blue-600 hover:to-cyan-600"
        >
          Search
        </Button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto max-w-7xl mx-auto border border-blue-100 dark:border-gray-800 rounded-2xl shadow-lg bg-white dark:bg-gray-900">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50 dark:bg-gray-800 text-black dark:text-cyan-200">
              <TableHead className="text-blue-900 dark:text-cyan-200">Name</TableHead>
              <TableHead className="text-blue-900 dark:text-cyan-200">Email</TableHead>
              <TableHead className="text-blue-900 dark:text-cyan-200">Mobile</TableHead>
              <TableHead className="text-blue-900 dark:text-cyan-200">Role</TableHead>
              <TableHead className="text-blue-900 dark:text-cyan-200 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                <TableCell className="font-semibold">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.mobile}</TableCell>
                <TableCell>
                  <Select
                    value={customer.role}
                    disabled
                  >
                    <SelectTrigger className="w-32 border-blue-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="microadmin">Microadmin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center space-x-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(customer.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {showDeleteModal && deleteUser && (
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="max-w-md bg-white dark:bg-gray-900 border border-blue-100 dark:border-gray-700 rounded-xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-red-700 dark:text-red-300">Delete Microadmin</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-gray-700">
              <p>Are you sure you want to delete <span className="font-bold text-red-600">{deleteUser.name}</span>?</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>Cancel</Button>
              <Button onClick={confirmDelete} loading={isDeleting} className="bg-red-600 text-white">Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
