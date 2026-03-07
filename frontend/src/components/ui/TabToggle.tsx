interface Tab {
  value: string;
  label: string;
}

interface TabToggleProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export function TabToggle({ tabs, activeTab, onChange }: TabToggleProps) {
  return (
    <div className="flex bg-gray-200 rounded-full p-1 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`flex-1 py-2 text-sm font-medium rounded-full text-center transition-colors ${
            activeTab === tab.value ? "bg-primary-bg text-white shadow-sm" : "text-gray-600"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
