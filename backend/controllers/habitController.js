import habitModel from "../models/Habitmodels";

const addHabit = async (req, res) => {
  try {
    const userId = req.user?.id;

    const { name, description, frequency } = req.body;

    if (!name || !frequency) {
      return res.status(401).josn({
        success: false,
        message: "All fields are required",
      });
    }

    const currentDate = new Date().toISOString();
    const newLogsEntry = { date: currentDate, completed: false };
    const logs = [newLogsEntry];

    const newHabit = new habitModel({
      userId,
      name,
      description,
      frequency,
      logs,
    });

    const savedHabit = await newHabit.save();

    res.status(201).json({
      success: true,
      message: "Habit adding successfully",
      data: savedHabit,
    });
  } catch (error) {
    console.log("error in add habit controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal add habit error",
    });
  }
};

const deleteHabit = async (req, res) => {
  try {
    const habitId = req.params.id;

    const deletedHabit = await habitModel.findByIdAndDelete(habitId);

    if (!deletedHabit) {
      res.status(404).json({
        success: false,
        message: "habit not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Habit Deleted successfully",
    });
  } catch (error) {
    console.log("error in Delete habit controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal Delete habit error",
    });
  }
};

const getHabit = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const habits = await habitModel.find(userId).exec();

    if (habits.length < 0 || habits.length === 0) {
      res.status(401).json({
        success: false,
        message: "No Habit found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Getting the Habit Successfully",
      data: habits,
    });
  } catch (error) {
    console.log("error in get habit controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal get habit error",
    });
  }
};

const editHbaits = async (req, res) => {
  try {
    const habitId = req.params;
    const userId = req.user?.id;
    const { name, description, frequency, logs } = req.body;

    const habit = await habitModel.findByIdAndUpdate(
      { _id: habitId, user: userId },
      { name, description, frequency, logs },
      { new: true }
    );

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "habit not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Edit habit done",
      data: habit,
    });
  } catch (error) {
    console.log("error in edit habit controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal edit habit error",
      edit,
    });
  }
};

const markCompleted = async (req, res) => {
  try {
    const habitId = req.params.id;
    const today = new Date().toISOString().split("T")[0];

    const updatedHabit = await habitModel.findByIdAndUpdate(
      { _id: habitId },
      {
        $set: {
          "logs.${log}.completed": true,
        },
      },
      { new: true, arrayFilters: [{ "log.date": today }] }
    );

    if (!updatedHabit) {
      return res.status(404).josn({
        success: false,
        message: "Habit not Found ",
      });
    }

    // if logs array doesn't contain todays date, we need to add it
    if (!updatedHabit.logs.find((log) => log.date === today)) {
      updatedHabit.log.push({
        date: today,
        completed: true,
      });

      await updatedHabit.save();
    }

    res.status(200).json({
      success: true,
      message: "Habit marked completed",
      data: updatedHabit,
    });
  } catch (error) {
    console.log("error in completed habit controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal completed habit error",
      edit,
    });
  }
};

export { addHabit, deleteHabit, getHabit, editHbaits, markCompleted };
