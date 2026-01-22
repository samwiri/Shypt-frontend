import React from "react";
import { Mail, CheckCircle, RefreshCw } from "lucide-react";

interface NotificationsTabProps {
  handleTestSmtp: () => void;
  isTestingSmtp: boolean;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({
  handleTestSmtp,
  isTestingSmtp,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Mail className="text-blue-600 mr-4" size={32} />
          <div>
            <h4 className="font-bold text-blue-900">Email Infrastructure</h4>
            <p className="text-sm text-blue-700">
              Configure how the system sends alerts to clients.
            </p>
          </div>
        </div>
        <button
          onClick={handleTestSmtp}
          disabled={isTestingSmtp}
          className="bg-white border border-blue-200 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition flex items-center"
        >
          {isTestingSmtp ? (
            <RefreshCw size={16} className="mr-2 animate-spin" />
          ) : (
            <CheckCircle size={16} className="mr-2" />
          )}
          Test Connection
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-bold text-slate-700">
            SMTP Host
          </label>
          <input
            type="text"
            defaultValue="smtp.sendgrid.net"
            className="mt-1 w-full border border-slate-300 rounded p-2 bg-white"
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-bold text-slate-700">
            SMTP Port
          </label>
          <input
            type="text"
            defaultValue="587"
            className="w-24 mt-1 border border-slate-300 rounded p-2 bg-white"
          />
        </div>
      </div>

      <div className="pt-8 border-t">
        <h3 className="text-lg font-medium text-slate-800 mb-4">
          Event-Driven Alerts
        </h3>
        <div className="space-y-3">
          {[
            "Package Receipt",
            "Manifest Departure",
            "Customs Arrival",
            "Invoice Issued",
          ].map((e) => (
            <div
              key={e}
              className="flex items-center justify-between p-4 border border-slate-100 rounded-lg"
            >
              <span className="text-sm font-medium text-slate-700">{e}</span>
              <div className="flex gap-4">
                <label className="flex items-center text-xs text-slate-500">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mr-2 rounded text-primary-600"
                  />{" "}
                  Email
                </label>
                <label className="flex items-center text-xs text-slate-500">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mr-2 rounded text-primary-600"
                  />{" "}
                  SMS
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;
