import React from "react";
import { Shield, Plus, Lock } from "lucide-react";
import { AuthUser } from "../../../api/types/auth";

interface SecurityTabProps {
  staff: AuthUser[];
  setModalType: (type: string | null) => void;
  setSelectedItem: (item: any) => void;
}

const SecurityTab: React.FC<SecurityTabProps> = ({
  staff,
  setModalType,
  setSelectedItem,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
        <h4 className="font-bold text-red-800 flex items-center text-lg">
          <Shield size={24} className="mr-3" /> Critical Operations Security
        </h4>
        <p className="text-sm text-red-700 mt-2 leading-relaxed">
          Enabling <strong>Strict Compliance Mode</strong> forces a secondary
          PIN verification whenever a staff member attempts to release cargo
          flagged by URA or Warehouse Compliance.
        </p>
        <div className="mt-4 flex items-center justify-between bg-white/50 p-3 rounded-lg border border-red-100">
          <span className="text-sm font-bold text-red-900">
            Require Supervisor PIN for Release
          </span>
          <button className="w-12 h-6 bg-red-600 rounded-full relative">
            <div className="absolute top-1 left-7 w-4 h-4 bg-white rounded-full"></div>
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-slate-800">
            Staff Access Control
          </h3>
          <button
            onClick={() => setModalType("STAFF")}
            className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded-md hover:bg-slate-700 font-bold"
          >
            + Invite User
          </button>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Permissions</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">
                      {s.full_name}
                    </div>
                    <div className="text-xs text-slate-500">{s.email}</div>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">
                    {s.user_type}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {(s as any).permissions?.map((p: string) => (
                        <span
                          key={p}
                          className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded border border-slate-200 font-bold"
                        >
                          {p}
                        </span>
                      )) || "No permissions"}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedItem(s);
                        setModalType("PERMISSIONS");
                      }}
                      className="text-primary-600 hover:bg-primary-50 p-1.5 rounded transition"
                      title="Edit Permissions"
                    >
                      <Lock size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
