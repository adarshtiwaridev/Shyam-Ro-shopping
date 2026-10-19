"use client";
 
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useSelector } from 'react-redux';
 

export default function CustomerManagement() {
 

  const [customers, setCustomers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    async function fetchUsers() {
      try {
       
        const res = await fetch("/api/admin/getusers?role=customer");
        const data = await res.json();
        if (res.ok && data.users) {
          setCustomers(
            data.users.map((u, idx) => ({
              id: u._id,
              name: `${u.firstName} ${u.lastName}`,
              email: u.email,
              mobile: u.mobile,
              role: u.role,
              orders: [],  
            }))
          );
        
        }
      } catch (err) {
         console.log(err)
      }
    }
    fetchUsers();
  }, []);

 

  const handleRoleChange = (id, newRole) => {
    if (newRole === "microadmin") {
      const user = customers.find((c) => c.id === id);
      setEditUser(user);
      setShowEditModal(true);
    } else {
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, role: newRole } : c))
      );
      // Optionally, handle other role changes here
    }
  };

  const handleUpdateRole = async () => {
    if (!editUser) return;
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/update-user-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: editUser.id, newRole: "microadmin" }),
      });
      const data = await res.json();
      if (res.ok) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === editUser.id ? { ...c, role: "microadmin" } : c))
        );
        toast.success("Role updated to microadmin");
        setShowEditModal(false);
        setEditUser(null);
      } else {
        toast.error(data.message || "Failed to update role");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter customers by name (case-insensitive, partial match)
  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchValue);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-950 py-10 px-2 sm:px-6 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <h2 className="text-3xl font-extrabold text-blue-700 dark:text-cyan-300 mb-8 text-center tracking-tight">Customer Management</h2>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-6">
        <Input
          type="text"
          placeholder="Search by user name..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full max-w-xs border border-blue-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        <Button type="submit" className="bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-cyan-700 dark:to-blue-800 text-white font-semibold shadow hover:from-blue-600 hover:to-cyan-600">Search</Button>
      </form>
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
              <TableRow key={customer?.id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                <TableCell className="font-semibold">{customer?.name}</TableCell>
                <TableCell>{customer?.email}</TableCell>
                <TableCell>{customer?.mobile}</TableCell>
                
                <TableCell>
                  {user?.role === 'admin' ? (
                    <Select
                      value={customer.role}
                      onValueChange={(val) => handleRoleChange(customer.id, val)}
                    >
                      <SelectTrigger className="w-32 border-blue-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-blue-200 dark:border-gray-700">
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="microadmin">Microadmin</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="capitalize text-gray-700 dark:text-gray-300">{customer.role}</span>
                  )}
                </TableCell>
                <TableCell className="text-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="border-blue-400 text-blue-700 bg-blue-50">View Orders</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-white dark:bg-gray-900 border border-blue-100 dark:border-gray-700 rounded-xl shadow-xl">
                      <DialogHeader>
                        <DialogTitle className="text-blue-700 dark:text-cyan-300">{customer.name}'s Order History</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2">
                        {customer?.orders?.length === 0 ? (
                          <p className="text-gray-500 dark:text-gray-300">No orders yet.</p>
                        ) : (
                          customer?.orders?.map((order) => (
                            <div key={order?.id} className="border border-blue-100 dark:border-gray-700 p-2 rounded-md bg-blue-50 dark:bg-gray-800 text-blue-900 dark:text-cyan-200">
                              <p><strong>ID:</strong> {order?.id}</p>
                              <p><strong>Date:</strong> {order?.date}</p>
                              <p><strong>Total:</strong> {order?.total}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {showEditModal && editUser && (
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-md bg-white dark:bg-gray-900 border border-blue-100 dark:border-gray-700 rounded-xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-blue-700 dark:text-cyan-300">Update Role for {editUser.name}</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-gray-700">
              <p>Are you sure you want to update the role to <span className="font-bold text-blue-600">microadmin</span>?</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditModal(false)} disabled={isUpdating}>Cancel</Button>
              <Button onClick={handleUpdateRole} loading={isUpdating} className="bg-blue-600 text-white">Confirm</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

CustomerManagement.requiredRole = 'admin';
