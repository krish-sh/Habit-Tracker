import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function HabitAnyalstic({ habits, selectedDate }) {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(
    new Date(selectedDate)
      .setDate(new Date(selectedDate).getDate() - 1)
      .toString()
      .split("T")[0]
  );
  const totalHabit = habits.length;

  const completedToday = habits.filter((habit) =>
    habit.logs.some((log) => log.date === selectedDate && log.completed)
  ).length;

  const completedYesterday = habits.filter((habit) =>
    habit.log.some((log) => log.date === yesterday && log.completed)
  ).length;

  const progressToday = totalHabit ? (completedToday / totalHabit) * 100 : 0;
  return (
    <div className="bg-white p-6 h-auto rounded-3xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 ">Analystics</h2>

      {selectedDate === today && (
        <div className="mb-5">
          <p className="text-4xl font-semibold text-gray-700">
            Total Habits Added:{" "}
            <span className="ml-2 font-bold text-gray-900">{totalHabit}</span>
          </p>
        </div>
      )}
      <div className="mb-5">
        <p className="text-xl font-semibold text-gray-700">
          Completed Habits{" "}
          {selectedDate === today ? "Today" : `on ${selectedDate}`}:{" "}
          <span>{completedToday}</span>
        </p>
      </div>
      <div className="mb-5 flex items-center justify-center mt-4">
        <div style={{ width: "200px", height: "200px" }}>
          <CircularProgressbar
            value={progressToday}
            text={`${Math.round(progressToday)}%`}
            styles={buildStyles({
              pathColor: "#140746",
              textColor: "#333",
              trailColor: "#ffff",
              textSize: "11px",
              pathTransition: "stroke-dashoffset 0.5s ease 0s",
            })}
          />
        </div>
      </div>
      <div className="flex flex-row justify-start items-center">
        <p className="text-lg font-semibold text-gray-700">
          {completedYesterday} Habits Completed Yesterday
        </p>
      </div>
    </div>
  );
}

export default HabitAnyalstic;
