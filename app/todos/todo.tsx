import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Dispatch, SetStateAction, useMemo } from "react";
import { Reminder } from "./reminder";

// Define custom styles for the component
const customScrollbarStyles = `
  /* Custom scrollbar styles */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar-color);
    border-radius: 6px;
    border: 1px solid transparent;
    background-clip: padding-box;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: var(--scrollbar-hover-color);
  }
`;

type Props = {
  reminder: Reminder;
  draggedreminder: string | null;
  activereminder: string | null;
  setActivereminder: Dispatch<SetStateAction<string | null>>;
  deletereminder: (id: string) => void;
  updateremindertext: (id: string, text: string) => void;
  handleMouseDown: (e: React.MouseEvent, reminderId: string) => void;
  handleTouchStart: (e: React.TouchEvent, reminderId: string) => void;
};

const Todo = (props: Props) => {
  const {
    reminder,
    activereminder,
    draggedreminder,
    setActivereminder,
    deletereminder,
    updateremindertext,
    handleMouseDown,
    handleTouchStart,
  } = props;
  const [colorClass, borderClass, gradientFrom, gradientTo] =
    reminder.color.split(" ");

  // Extract color details for scrollbar styling
  const getScrollbarColors = useMemo(() => {
    // Map color names to their hex values
    const colorMap: Record<string, Record<string, string>> = {
      yellow: {
        "300": "#fde047",
        "400": "#facc15",
        "500": "#eab308",
      },
      green: {
        "300": "#86efac",
        "400": "#4ade80",
        "500": "#22c55e",
      },
      blue: {
        "300": "#93c5fd",
        "400": "#60a5fa",
        "500": "#3b82f6",
      },
      pink: {
        "300": "#f9a8d4",
        "400": "#f472b6",
        "500": "#ec4899",
      },
      purple: {
        "300": "#d8b4fe",
        "400": "#c084fc",
        "500": "#a855f7",
      },
    };

    // Extract color name and shade from the class
    const colorMatch = borderClass.match(/border-(\w+)-(\d+)/);
    if (colorMatch) {
      const [_, colorName, shade] = colorMatch;

      // Get the color values
      const baseColor = colorMap[colorName]?.[shade] || "#c084fc"; // Default to purple-400
      const hoverColor =
        colorMap[colorName]?.[`${parseInt(shade) + 100}`] || "#a855f7"; // Default to purple-500

      return { baseColor, hoverColor };
    }

    return { baseColor: "#c084fc", hoverColor: "#a855f7" }; // Default to purple
  }, [borderClass]);

  // Custom scrollbar styles
  const scrollbarStyles = {
    "--scrollbar-color": getScrollbarColors.baseColor,
    "--scrollbar-hover-color": getScrollbarColors.hoverColor,
  } as React.CSSProperties;

  return (
    <div
      className={`absolute shadow-md rounded-md ${colorClass} border-2 ${borderClass} w-64 text-purple-950 overflow-hidden custom-scrollbar`}
      style={{
        left: `${reminder.left}px`,
        top: `${reminder.top}px`,
        zIndex:
          draggedreminder === reminder.id || activereminder === reminder.id
            ? 10
            : 1,
        ...scrollbarStyles,
      }}
      onClick={() => setActivereminder(reminder.id)}
    >
      {/* Inject custom scrollbar styles */}
      <style dangerouslySetInnerHTML={{ __html: customScrollbarStyles }} />

      {/* Grabbable header */}
      <div
        className={`h-7 w-full bg-gradient-to-r ${gradientFrom} ${gradientTo} flex items-center cursor-grab`}
        onMouseDown={(e) => handleMouseDown(e, reminder.id)}
        onTouchStart={(e) => handleTouchStart(e, reminder.id)}
      >
        <div className="w-full h-full px-2">
          <div className="flex justify-between items-center h-full">
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-white/60" />
              ))}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 rounded-full opacity-70 text-purple-950 hover:opacity-100 hover:bg-red-300"
              onClick={(e) => {
                e.stopPropagation();
                deletereminder(reminder.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {activereminder === reminder.id ? (
        <div className="p-3">
          <textarea
            className="w-full h-32 bg-transparent resize-none focus:outline-none text-purple-950 custom-scrollbar"
            value={reminder.text}
            onChange={(e) => updateremindertext(reminder.id, e.target.value)}
            onBlur={() => setActivereminder(null)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setActivereminder(null);
              }
            }}
            autoFocus
          />
        </div>
      ) : (
        <div className="whitespace-pre-wrap min-h-[8rem] break-words p-3 text-purple-950 overflow-y-auto custom-scrollbar">
          {reminder.text || "Click to edit"}
        </div>
      )}

      {/* Footer with creation date */}
      <div className="text-xs text-purple-950/60 px-3 pb-2 text-right italic">
        Created: {new Date(reminder.createdAt).toLocaleString()}
      </div>
    </div>
  );
};

export default Todo;
