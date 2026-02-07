import { useState } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import type { TaskTemplate } from "../types";

const ICON_OPTIONS = [
  "🎵",
  "🎼",
  "🎹",
  "🇮🇱",
  "⭐",
  "🎶",
  "🎤",
  "🎸",
  "🎻",
  "💃",
  "🌟",
  "🦄",
];

interface SettingsPageProps {
  templates: TaskTemplate[];
  onAdd: (template: Omit<TaskTemplate, "id">) => void;
  onUpdate: (id: number, updates: Partial<Omit<TaskTemplate, "id">>) => void;
  onDelete: (id: number) => void;
}

function TemplateRow({
  template,
  onUpdate,
  onDelete,
}: {
  template: TaskTemplate;
  onUpdate: (id: number, updates: Partial<Omit<TaskTemplate, "id">>) => void;
  onDelete: (id: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(template.text);
  const [icon, setIcon] = useState(template.icon);
  const [xp, setXp] = useState(template.xp);
  const [showIcons, setShowIcons] = useState(false);

  function handleSave() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onUpdate(template.id, { text: trimmed, icon, xp });
    setIsEditing(false);
    setShowIcons(false);
  }

  function handleCancel() {
    setText(template.text);
    setIcon(template.icon);
    setXp(template.xp);
    setIsEditing(false);
    setShowIcons(false);
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-3xl p-4 shadow-lg shadow-pink-100/50 border-2 border-pink-200 space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowIcons(!showIcons)}
            className="h-12 w-12 rounded-2xl bg-pink-100 flex items-center justify-center text-2xl shadow-inner shrink-0 hover:bg-pink-200 transition-colors"
          >
            {icon}
          </button>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 rounded-xl border-2 border-pink-200 px-3 py-2 text-right font-bold text-gray-700 focus:outline-none focus:border-pink-400 transition-colors"
            placeholder="שם המשימה"
            dir="rtl"
          />
        </div>

        {showIcons && (
          <div className="flex flex-wrap gap-2 p-2 bg-pink-50 rounded-2xl">
            {ICON_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setIcon(emoji);
                  setShowIcons(false);
                }}
                className={`text-2xl p-2 rounded-xl transition-colors ${
                  icon === emoji ? "bg-pink-200" : "hover:bg-pink-100"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <label className="text-sm font-bold text-gray-500">נקודות:</label>
          <input
            type="number"
            min={5}
            max={100}
            step={5}
            value={xp}
            onChange={(e) => setXp(Number(e.target.value))}
            className="w-20 rounded-xl border-2 border-pink-200 px-3 py-2 text-center font-bold text-gray-700 focus:outline-none focus:border-pink-400 transition-colors"
          />
          <div className="flex-1" />
          <button
            onClick={handleSave}
            className="p-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            <Check size={20} />
          </button>
          <button
            onClick={handleCancel}
            className="p-2 rounded-xl bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-4 shadow-lg shadow-pink-100/50 border-2 border-transparent flex items-center text-right">
      <div className="h-12 w-12 rounded-2xl bg-pink-100 flex items-center justify-center text-2xl shadow-inner ml-4 shrink-0">
        {template.icon}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-lg text-gray-700">{template.text}</h3>
        <span className="text-xs font-semibold text-pink-400">
          +{template.xp} נק'
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 rounded-xl bg-pink-50 text-pink-500 active:bg-pink-100 hover:bg-pink-100 transition-colors"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(template.id)}
          className="p-2 rounded-xl bg-red-50 text-red-400 active:bg-red-100 hover:bg-red-100 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export function SettingsPage({
  templates,
  onAdd,
  onUpdate,
  onDelete,
}: SettingsPageProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newText, setNewText] = useState("");
  const [newIcon, setNewIcon] = useState("🎵");
  const [newXp, setNewXp] = useState(15);
  const [showIcons, setShowIcons] = useState(false);

  function handleAdd() {
    const trimmed = newText.trim();
    if (!trimmed) return;
    onAdd({ text: trimmed, icon: newIcon, xp: newXp });
    setNewText("");
    setNewIcon("🎵");
    setNewXp(15);
    setShowAdd(false);
    setShowIcons(false);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-pink-500 mb-4 px-2">
        עריכת משימות ⚙️
      </h2>

      <p className="text-sm text-gray-400 px-2">
        כאן אפשר לשנות את המשימות היומיות. השינויים ייכנסו לתוקף מחר.
      </p>

      {templates.map((template) => (
        <TemplateRow
          key={template.id}
          template={template}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}

      {templates.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-lg font-bold">אין משימות עדיין</p>
          <p className="text-sm mt-1">לחצי על הכפתור למטה להוסיף</p>
        </div>
      )}

      {showAdd ? (
        <div className="bg-white rounded-3xl p-4 shadow-lg shadow-pink-100/50 border-2 border-pink-200 space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowIcons(!showIcons)}
              className="h-12 w-12 rounded-2xl bg-pink-100 flex items-center justify-center text-2xl shadow-inner shrink-0 hover:bg-pink-200 transition-colors"
            >
              {newIcon}
            </button>
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="flex-1 rounded-xl border-2 border-pink-200 px-3 py-2 text-right font-bold text-gray-700 focus:outline-none focus:border-pink-400 transition-colors"
              placeholder="שם המשימה"
              dir="rtl"
              autoFocus
            />
          </div>

          {showIcons && (
            <div className="flex flex-wrap gap-2 p-2 bg-pink-50 rounded-2xl">
              {ICON_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setNewIcon(emoji);
                    setShowIcons(false);
                  }}
                  className={`text-2xl p-2 rounded-xl transition-colors ${
                    newIcon === emoji ? "bg-pink-200" : "hover:bg-pink-100"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <label className="text-sm font-bold text-gray-500">נקודות:</label>
            <input
              type="number"
              min={5}
              max={100}
              step={5}
              value={newXp}
              onChange={(e) => setNewXp(Number(e.target.value))}
              className="w-20 rounded-xl border-2 border-pink-200 px-3 py-2 text-center font-bold text-gray-700 focus:outline-none focus:border-pink-400 transition-colors"
            />
            <div className="flex-1" />
            <button
              onClick={handleAdd}
              className="p-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              <Check size={20} />
            </button>
            <button
              onClick={() => {
                setShowAdd(false);
                setShowIcons(false);
              }}
              className="p-2 rounded-xl bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full bg-linear-to-l from-pink-400 to-purple-400 text-white rounded-3xl p-4 flex items-center justify-center gap-2 font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={24} />
          הוספת משימה
        </button>
      )}
    </div>
  );
}
