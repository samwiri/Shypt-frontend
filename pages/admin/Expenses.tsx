import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingDown,
  Plus,
  FileText,
  Calendar,
  Settings,
} from "lucide-react";
import { DataTable, Column } from "../../components/UI/DataTable";
import Modal from "../../components/UI/Modal";
import { useToast } from "../../context/ToastContext";
import useExpenses from "../../api/expenses/useExpenses";
import { Expense, ExpenseCategory } from "../../api/types/expenses";

const Expenses: React.FC = () => {
  const { showToast } = useToast();
  const {
    listExpenses,
    listExpenseCategories,
    createExpense,
    createExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory,
  } = useExpenses();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const triggerNav = (path: string) => {
    window.dispatchEvent(new CustomEvent("app-navigate", { detail: path }));
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [expensesRes, categoriesRes] = await Promise.all([
        listExpenses(),
        listExpenseCategories(),
      ]);
      console.log("expensesRes", expensesRes);
      console.log("categoriesRes", categoriesRes);
      // @ts-ignore
      setExpenses(expensesRes);
      setCategories(categoriesRes.data);
    } catch (error) {
      showToast("Failed to fetch data. Please try again.", "error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const newExp = {
      expense_category_id: Number(fd.get("category_id")),
      particular:
        (fd.get("description") as string) +
        " " +
        `Linked Manifest: ${fd.get("manifest") as string} Vendor: ${fd.get("paidTo") as string}`,
      unit_price: Number(fd.get("amount")),
      date: fd.get("date") as string,
      quantity: 1,
      // linked_manifest: fd.get("manifest") as string,
      // vendor: fd.get("paidTo") as string,
      // status: "PAID",
    };
    try {
      await createExpense(newExp as any);
      showToast("Expense Recorded", "success");
      setIsFormOpen(false);
      fetchData(); // Refresh data
    } catch (error) {
      showToast("Failed to record expense.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [editingCategory, setEditingCategory] =
    useState<ExpenseCategory | null>(null);

  const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const description = fd.get("description") as string;

    try {
      if (editingCategory) {
        await updateExpenseCategory(editingCategory.id, { name, description });
        showToast("Category updated", "success");
      } else {
        await createExpenseCategory({ name, description });
        showToast("Category created", "success");
      }
      setEditingCategory(null);
      fetchData();
    } catch (error) {
      console.error(error);
      showToast("Failed to save category.", "error");
    }
  };

  const handleCategoryDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteExpenseCategory(id);
        showToast("Category deleted", "success");
        fetchData(); // Refresh categories
      } catch (error) {
        showToast("Failed to delete category. It might be in use.", "error");
      }
    }
  };

  const columns: Column<Expense>[] = [
    {
      header: "ID",
      accessor: (exp) => (
        <span className="font-mono text-xs text-primary-600 hover:underline">
          EXP-{exp.id}
        </span>
      ),
      sortKey: "id",
      sortable: true,
    },
    { header: "Date", accessor: "date", sortable: true },
    {
      header: "Category",
      accessor: (exp) => exp.category?.name || "N/A",
      // sortKey: "category.name",
      sortable: true,
      className: "text-xs font-bold",
    },
    { header: "Description", accessor: "description" },
    { header: "Paid To", accessor: "vendor" },
    {
      header: "Amount",
      accessor: (exp) => (
        <span className="font-bold text-red-600">
          -${exp.amount.toFixed(2)}
        </span>
      ),
      sortKey: "amount",
      sortable: true,
      className: "text-right",
    },
    {
      header: "Status",
      accessor: (exp) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            exp.status === "PAID"
              ? "bg-slate-100 text-slate-600"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {exp.status}
        </span>
      ),
    },
  ];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Operational Expenses
          </h2>
          <p className="text-slate-500 text-sm">
            Track Cost of Sales (COS) and payouts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-white text-slate-600 border border-slate-300 px-4 py-2 rounded-md hover:bg-slate-50 flex items-center shadow-sm text-sm font-medium"
          >
            <Settings size={16} className="mr-2" /> Manage Categories
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center shadow-sm text-sm font-medium"
          >
            <Plus size={16} className="mr-2" /> Record Expense
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <p className="text-slate-500 text-sm font-medium">
            Total Expenses (All Time)
          </p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>
        {/* <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <p className="text-slate-500 text-sm font-medium">
            Net Profit (Est.)
          </p>
          <p className="text-2xl font-bold text-green-600 mt-1">$4,250.00</p>
          <p className="text-xs text-slate-400">Revenue - Expenses</p>
        </div> */}
      </div>
      {isLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <DataTable
          data={expenses}
          columns={columns}
          onRowClick={(exp) => triggerNav(`/admin/expenses/${exp.id}`)}
          title="Expense Ledger"
          searchPlaceholder="Search Expenses..."
        />
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Record New Expense"
      >
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                name="category_id"
                required
                className="w-full border p-2 rounded mt-1 bg-white text-slate-900"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Date
              </label>
              <input
                type="date"
                name="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full border p-2 rounded mt-1 bg-white text-slate-900"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <input
              name="description"
              required
              placeholder="e.g. Flight EK202 Charges"
              className="w-full border p-2 rounded mt-1 bg-white text-slate-900"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Amount (USD)
              </label>
              <input
                name="amount"
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                className="w-full border p-2 rounded mt-1 bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Paid To
              </label>
              <input
                name="paidTo"
                required
                placeholder="Vendor Name"
                className="w-full border p-2 rounded mt-1 bg-white text-slate-900"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Linked Manifest (Optional)
            </label>
            <input
              name="manifest"
              placeholder="e.g. MAWB-001"
              className="w-full border p-2 rounded mt-1 bg-white text-slate-900"
            />
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              {isSubmitting ? "Saving..." : "Save Expense"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Category Management Modal */}

      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);

          setEditingCategory(null);
        }}
        title="Manage Expense Categories"
      >
        <div className="space-y-4">
          <form onSubmit={handleCategorySubmit} className="flex gap-2">
            <input
              name="name"
              defaultValue={editingCategory?.name}
              placeholder="Category Name"
              className="w-full border p-2 rounded bg-white text-slate-900"
              required
            />

            <input
              name="description"
              defaultValue={editingCategory?.description}
              placeholder="Description (optional)"
              className="w-full border p-2 rounded bg-white text-slate-900"
            />

            <button
              type="submit"
              className="bg-primary-600 text-white px-4 rounded hover:bg-primary-700"
            >
              {editingCategory ? "Update" : "Add"}
            </button>

            {editingCategory && (
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="text-slate-500"
              >
                Cancel
              </button>
            )}
          </form>

          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex justify-between items-center p-2 border rounded"
              >
                <div>
                  <p className="font-bold">{cat.name}</p>

                  <p className="text-sm text-slate-500">{cat.description}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingCategory(cat)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleCategoryDelete(cat.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Expenses;
