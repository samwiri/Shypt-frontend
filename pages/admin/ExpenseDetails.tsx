import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, FileText, Ban, UploadCloud, Loader } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import useExpenses from "../../api/expenses/useExpenses";
import { Expense } from "../../api/types/expenses";

interface ExpenseDetailsProps {
  id: string;
  onBack: () => void;
}

const ExpenseDetails: React.FC<ExpenseDetailsProps> = ({ id, onBack }) => {
  const { showToast } = useToast();
  const { getExpense, updateExpense } = useExpenses();

  const [expense, setExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchExpense = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getExpense(parseInt(id, 10));
      setExpense(res.data);
    } catch (err) {
      setError("Failed to fetch expense details.");
      showToast("Error fetching details", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, [id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && expense) {
        setIsUploading(true);
        try {
            await updateExpense(expense.id, { receipt: file });
            showToast("Receipt uploaded successfully!", "success");
            fetchExpense(); // Refresh data
        } catch (error) {
            showToast("Failed to upload receipt.", "error");
        } finally {
            setIsUploading(false);
        }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (!expense) {
    return <div className="text-center text-slate-500">No expense found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {expense.description}
            </h2>
            <p className="text-sm text-slate-500">ID: EXP-{expense.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold flex items-center
              ${
                expense.status === "PAID"
                  ? "bg-green-100 text-green-700"
                  : expense.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
          >
            {expense.status === "PAID" ? (
              <CheckCircle size={14} className="mr-1" />
            ) : (
              <Ban size={14} className="mr-1" />
            )}
            {expense.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">
            Transaction Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">Amount</span>
              <span className="font-bold text-lg text-slate-900">
                ${expense.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">Date</span>
              <span className="text-slate-900 text-sm">{expense.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">Category</span>
              <span className="text-slate-900 text-sm font-medium">
                {expense.category?.name || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">Paid To</span>
              <span className="text-slate-900 text-sm">{expense.vendor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-sm">Authorized By</span>
              <span className="text-slate-900 text-sm">{expense.paid_by}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">
            Receipt / Proof of Payment
          </h3>
          {expense.receipt_url ? (
             <div className="relative">
                <img src={expense.receipt_url} alt="Receipt" className="rounded-lg w-full h-auto max-h-64 object-cover"/>
                <a href={expense.receipt_url} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full">
                    <FileText size={16}/>
                </a>
             </div>
          ) : (
            <div className="h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded flex flex-col items-center justify-center text-slate-400">
              <UploadCloud size={32} className="mb-2" />
              <p className="text-sm">No receipt attached.</p>
              <label className="mt-2 text-blue-600 text-xs font-medium hover:underline cursor-pointer">
                {isUploading ? "Uploading..." : "Upload Receipt"}
                <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading}/>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetails;