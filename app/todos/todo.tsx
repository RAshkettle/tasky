import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Reminder } from "./reminder";
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
  return (
    <div
      
      className={`absolute shadow-md rounded-md ${colorClass} border-2 ${borderClass} w-64 text-purple-950 overflow-hidden`}
      style={{
        left: `${reminder.left}px`,
        top: `${reminder.top}px`,
        zIndex:
          draggedreminder === reminder.id || activereminder === reminder.id
            ? 10
            : 1,
      }}
      onClick={() => setActivereminder(reminder.id)}
    >
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
            className="w-full h-32 bg-transparent resize-none focus:outline-none text-purple-950"
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
        <div className="whitespace-pre-wrap min-h-[8rem] break-words p-3 text-purple-950">
          {reminder.text || "Click to edit"}
        </div>
      )}
    </div>
  );
};

export default Todo;
