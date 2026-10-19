"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { CheckCircle, ArrowLeft, ArrowRight, ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import SEO from "@/src/components/SEO";
import siteConfig from "@/src/config/site";

export default function BuildPage() {
  const router = useRouter();

  // Get categories and products from Redux
  const categories = useSelector((state) => state.category.categories);
  const products = useSelector((state) => state.product.products);

  // Only use categories of type "customcategory" (or change as needed)
  const buildCategories = useMemo(
    () => categories.filter((cat) => (cat.categoryType === "customcategory" || cat.categoryType === "customplushome")  ),
    [categories]
  );

const steps = buildCategories
  .map((cat) => ({
    id: cat._id,
    name: cat.name,
    image: cat.catImage,
  }))
  .reverse(); // Descending order

const allSteps = [
  ...steps,
  { id: "review", name: "Review", image: null },
];


 

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedComponents, setSelectedComponents] = useState({});

  // Get current step info
  const currentStepObj = allSteps[currentStep];
  const isReviewStep = currentStepObj?.id === "review";

  // Get current category
  const matchedCategory = buildCategories.find(cat => cat?._id === currentStepObj?.id);
  const productIdsFromCategory = matchedCategory?.products || [];

  // Get products for the current category
const currentCategoryProducts = useMemo(() => {
  if (isReviewStep || !matchedCategory) return [];

  return products.filter((prod) => {
    // If product has category object
    if (typeof prod?.category === "object" && prod?.category?._id) {
      return prod?.category?._id === matchedCategory?._id && (prod?.productType === "customproduct" || prod?.productType === "customplushome")  ;
    }

    // If product has category string
    if (typeof prod?.category === "string") {
      return prod?.category === matchedCategory?._id;
    }

    // Or, if product ID is listed in category's products array
    return productIdsFromCategory?.includes(prod?._id);
  });
}, [products, matchedCategory, isReviewStep]);

   console.log("STEP ID:", currentStepObj.id);

console.log("Current Category Products:", currentCategoryProducts);
   


  // Calculate total price
  const totalPrice = Object.values(selectedComponents).reduce(
    (sum, prod) => sum + (prod.price || 0),
    0
  );
  const installationPrice = 999;
  const finalPrice = totalPrice + installationPrice;

  // Handlers
  const handleComponentSelect = (product) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [currentStepObj.id]: product,
    }));
  };

  const handleNext = () => {
    if (currentStep < allSteps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // Step content
  const renderStepContent = () => {
    if (isReviewStep) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Your Custom RO Configuration
            </h3>
            <div className="space-y-4">
              {steps.map((step) => {
                const prod = selectedComponents[step.id];
                if (!prod) return null;
                return (
                  <div
                    key={step.id}
                    className="flex items-center justify-between p-4 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {step.image && (
                        <img
                          src={step.image}
                          alt={step.name}
                          className="w-10 h-10 rounded-full border object-cover"
                        />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {prod.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {prod.description}
                        </p>
                      </div>
                    </div>
                    
                  </div>
                );
              })}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Installation</span>
                  <span className="font-semibold text-blue-600">
                    ₹{installationPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold mt-2">
                  <span>Total Price</span>
                  <span className="text-blue-600">
                    ₹{finalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">
                Free Installation Included!
              </h3>
            </div>
            <p className="text-green-700">
              Your custom RO system will be professionally installed by our certified technicians at no additional cost.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="cursor-pointer text-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2 " />
              Previous
            </Button>
            <div className="w-full sm:w-auto sm:ml-auto">
              <Button
                onClick={() => {
                  localStorage.setItem("custom-ro-config", JSON.stringify({
                    selectedComponents,
                    totalPrice,
                    installationPrice,
                    finalPrice
                  }));
                  router.push("/customer/billingorder?custom=1");
                }}
                className="w-full cursor-pointer sm:w-64 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:scale-105 transition-all duration-300 rounded-xl px-6 py-4 text-base font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingCart className="w-5 h-5 " />
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Product selection step
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Select {currentStepObj.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCategoryProducts.length === 0 && (
              <div className="col-span-full text-gray-500">
                No products available for this category.
              </div>
            )}
            {currentCategoryProducts.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                  selectedComponents[currentStepObj.id]?._id === product._id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => handleComponentSelect(product)}
              >
                {product.isRecommended && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Recommended
                  </div>
                )}
                <div className="h-32 flex items-center justify-center mb-4">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-34 w-34 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="text-4xl text-blue-600">💧</div>
                  )}
                </div>
                <h4 className="font-semibold mb-2 text-green-700">
                  {product.name}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {product.description}
                </p>
                <div className="space-y-2 mb-4">
                  {product.features &&
                    product.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-xs text-gray-500"
                      >
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {feature}
                      </div>
                    ))}
                </div>
                 
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="cursor-pointer text-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={handleNext}
            className="cursor-pointer text-gray-100"
            disabled={!selectedComponents[currentStepObj.id]}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <SEO
        title="Custom RO System Builder"
        description={`Customize your reverse osmosis water purifier with modular filters, membranes, pumps, and storage tanks at ${siteConfig.brandName}.`}
        canonical="/custom-room"
      />
      <div className="min-h-screen relative bg-white text-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-28">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Build Your Custom RO System
            </h1>
          <p className="text-lg text-gray-600">
            Design your perfect water purification system with our modular components
          </p>
        </div>
        {/* Progress Steps */}
        <div className="mb-8">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
              {allSteps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                        isActive
                          ? "border-blue-500 bg-blue-500 text-white"
                          : isCompleted
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-gray-300 text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : step.image ? (
                        <img
                          src={step.image}
                          alt={step.name}
                          className="h-8 w-8 object-cover rounded-full"
                        />
                      ) : (
                        <CheckCircle className="h-6 w-6" />
                      )}
                    </div>
                    <div className="ml-3">
                      <div
                        className={`text-sm font-medium ${
                          isActive
                            ? "text-blue-600"
                            : isCompleted
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap mt-6 gap-4 items-center justify-center">
              {allSteps.map((_, index) =>
                index < allSteps.length - 1 ? (
                  <div
                    key={index}
                    className={`flex-1 h-0.5 max-w-[60px] ${
                      index < currentStep ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                ) : null
              )}
            </div>
          </div>
          {/* Large Screen Layout */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between">
              {allSteps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                          isActive
                            ? "border-blue-500 bg-blue-500 text-white"
                            : isCompleted
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-gray-300 text-gray-400"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : step.image ? (
                          <img
                            src={step.image}
                            alt={step.name}
                            className="h-8 w-8 object-cover rounded-full"
                          />
                        ) : (
                          <CheckCircle className="h-6 w-6" />
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <div
                          className={`text-sm font-medium whitespace-nowrap ${
                            isActive
                              ? "text-blue-600"
                              : isCompleted
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {step.name}
                        </div>
                      </div>
                    </div>
                    {index < allSteps.length - 1 && (
                      <div className="flex-1 -mt-5 mx-4">
                        <div
                          className={`h-0.5 w-full transition-colors ${
                            index < currentStep ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Step Content */}
        {renderStepContent()}
        {/* Price Summary */}
        {!isReviewStep && Object.keys(selectedComponents).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Current Configuration</h3>
            <div className="space-y-2">
              {steps.map((step) => {
                const prod = selectedComponents[step.id];
                if (!prod) return null;
                return (
                  <div key={step.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{prod.name}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
    </>
  );
}