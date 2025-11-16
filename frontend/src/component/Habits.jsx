import React, { useContext, useState } from "react";
import { HabitContext } from "../context/HabitContext";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import HabitAnyalstic from "./HabitAnyalstic";

const Habits = () => {
  const {
    habitData,
    markCompleted,
    fetchHabits,
    deleteHabits,
    editHabits,
    addHabits,
  } = useContext(HabitContext);

  const [showModel, setShowModel] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    frequency: [],
    logs: [],
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const markCompleteclick = async (id) => {
    try {
      await markCompleted(id);
    } catch (error) {
      console.log("Error completing the habit");
    }
  };

  const addHabitHandler = async (e) => {
    e.preventDefault();
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      await addHabits(newHabit.name, newHabit.description, newHabit.frequency, [
        { date: currentDate, completed: false },
      ]);
      setShowModel(false);

      setNewHabit({
        name: "",
        description: "",
        frequency: [],
        logs: [],
      });
    } catch (error) {
      console.log(error);
      console.log(error.response?.data?.message);

      toast.error("Error in Adding Habit");
    }
  };

  const deleteHandler = async (id) => {
    try {
      await deleteHabits(id);
    } catch (error) {
      console.log("Error in delete Handler");
    }
  };

  const editHandler = async (habit) => {
    try {
      setIsEditMode(true);
      setEditId(habit._id);

      setNewHabit({
        name: habit.name,
        description: habit.description,
        frequency: habit.frequency,
        logs: habit.logs,
      });
      setShowModel(true);
    } catch (error) {
      console.log("Error in Edit handler :", error);
    }
  };

  const updateEditHandler = async (e) => {
    e.preventDefault();
    try {
      editHabits(
        editId,
        newHabit.name,
        newHabit.description,
        newHabit.frequency
      );
      toast.success("Edit habit Successfully ");

      setShowModel(false);
      setIsEditMode(false);

      setNewHabit({
        name: "",
        description: "",
        frequency: [],
        logs: [],
      });
    } catch (error) {
      console.log("Error in update Edit handler:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center ">
        <h1 className="lg:text-2xl text-lg font-bold">Habit Tracker</h1>
        <div className="flex flex-col items-center">
          <label htmlFor="date" className="text-xs md:text-lg ">
            Pick the Date
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-800 rounded px-2 py-1 focus:outline-none shadow-lg"
          />
        </div>
      </div>
      <button
        onClick={() => setShowModel(true)}
        className="bg-red-600 px-4 py-2 text-white rounded-xl hover:scale-105 transition-all duration-300"
      >
        Add Habit
      </button>
      {showModel && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4 ">
              {isEditMode ? "Edit Habit" : "Add new Habit"}
            </h2>
            <form onSubmit={isEditMode ? updateEditHandler : addHabitHandler}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, name: e.target.value })
                  }
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={newHabit.description}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, description: e.target.value })
                  }
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">frequency</label>
                <select
                  className="w-full border px-2 py-1 rounded"
                  value={newHabit.frequency}
                  onChange={(e) =>
                    setNewHabit({
                      ...newHabit,
                      frequency: Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      ),
                    })
                  }
                  multiple
                  required
                >
                  <option value="daily">Daily</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowModel(false)}
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 text-white px-4 py-2 rounded"
                >
                  {isEditMode ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-gray-200 p-4 rounded-3xl shadow">
          <h2 className="text-3xl font-bold mb-4 ">Your Habits</h2>
          <div className="space-y-4 overflow-y-auto h-96">
            {(habitData || []).map((habit, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3  bg-[#F7E4EA] text-white rounded shadow-lg border border-[#D9A5B4]"
              >
                <div>
                  <h3
                    className={`font-bold text-xl text-gray-800 ${
                      habit.logs.find((log) => log.date === selectedDate)
                        ?.completed
                        ? "line-through"
                        : ""
                    }`}
                  >
                    {habit.name}
                  </h3>
                  <p
                    className={`font-semibold text-gray-600 ${
                      habit.logs.find((log) => log.date === selectedDate)
                        ?.completed
                        ? "line-through"
                        : ""
                    }`}
                  >
                    {habit.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedDate === today && (
                    <>
                      <button
                        onClick={() => markCompleteclick(habit._id)}
                        className="md:px-4 md:py-2 px-2 rounded bg-[#140746] py-1 text-sm hover:scale-110 transition-all duration-300"
                      >
                        {habit.logs.find((log) => log.date === selectedDate)
                          ?.completed
                          ? "Completed"
                          : "Mark as Done"}
                      </button>
                      <button onClick={() => editHandler(habit)}>
                        <FaEdit className="text-2xl text-blue-500" />
                      </button>
                      <button>
                        <MdOutlineDeleteOutline
                          onClick={(e) => deleteHandler(habit._id)}
                          className="text-2xl text-red-500"
                        />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <HabitAnyalstic habits={habitData} selectedDate={selectedDate} />
      </div>
    </div>
  );
};

export default Habits;
