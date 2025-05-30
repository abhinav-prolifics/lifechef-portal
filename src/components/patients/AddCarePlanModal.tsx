import React, { useState } from "react";
import { carePlans } from "../../data/mockData";
import { CarePlan } from "../../types";
import Button from "../ui/Button";
import Input from "../ui/Input";
interface AddCarePlanModalProps {
  showModal: boolean;
  onClose: () => void;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AddCarePlanModal: React.FC<AddCarePlanModalProps> = (props) => {
  const { showModal, onClose } = props;
  const [carePlan, setCarePlan] = useState({
    name: "",
    plan: "",
    startDate: "",
    endDate: "",
    description: "",
    goals: [{ goal: "", targetDate: "" }],
    meals: [""],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Care plan added!");

    // ✅ Reset the form by setting it back to the initial shape
    setCarePlan({
      name: "",
      plan: "",
      startDate: "",
      endDate: "",
      description: "",
      goals: [{ goal: "", targetDate: "" }],
      meals: [""],
    });

    // ✅ Optionally close the modal
    onClose();
  };
  const handleGoalChange = (
    index: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: any,
    value: string
  ) => {
    const updatedGoals = [...carePlan.goals];
    updatedGoals[index] = {
      ...updatedGoals[index],
      [field]: value,
    };
    setCarePlan({ ...carePlan, goals: updatedGoals });
  };

  const handleMealChange = (index: number, value: string) => {
    const updatedMeals = [...carePlan.meals];
    updatedMeals[index] = value;
    setCarePlan({ ...carePlan, meals: updatedMeals });
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCarePlan({ ...carePlan, [name]: value });
  };

  const addGoal = () => {
    setCarePlan({
      ...carePlan,
      goals: [...carePlan.goals, { goal: "", targetDate: "" }],
    });
  };

  const removeGoal = (indexToRemove: number) => {
    setCarePlan((prev) => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== indexToRemove),
    }));
  };

  const removeMeal = (indexToRemove: number) => {
    setCarePlan((prev) => ({
      ...prev,
      meals: prev.meals.filter((_, i) => i !== indexToRemove),
    }));
  };

  const addMeal = () => {
    setCarePlan({ ...carePlan, meals: [...carePlan.meals, ""] });
  };

  return (
    <>
      {" "}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => onClose()}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">
                Add Care Plan
              </h2>
              <button
                onClick={() => onClose()}
                className="text-gray-400 hover:text-gray-500"
              ></button>
            </div>
            <div className="p-4 pb-0 text-xl">
              <span>Patient Name: </span>
              <span>John Doe</span>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="flex flex-col">
                <label className="mb-2">Select Care Plan</label>
                <select  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {carePlans.map((item: CarePlan) => {
                    return <option className="font text-gray-500">{item.title}</option>;
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={carePlan.startDate}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <Input
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={carePlan.endDate}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </div>

              {/* Goals Section */}
              <div>
                <h4 className="text-xl font-semibold mt-6 mb-2">Goals</h4>
                {carePlan.goals.map((goal, index) => (
                  <div key={index} className="flex gap-4 items-end mb-2">
                    <Input
                      label="Goal"
                      value={goal.goal}
                      onChange={(e) =>
                        handleGoalChange(index, "goal", e.target.value)
                      }
                      fullWidth
                    />
                    <Input
                      label="Target Date"
                      type="date"
                      value={goal.targetDate}
                      onChange={(e) =>
                        handleGoalChange(index, "targetDate", e.target.value)
                      }
                      fullWidth
                    />
                    <button
                      type="button"
                      onClick={() => removeGoal(index)}
                      className="text-red-500 text-xl font-bold px-2 hover:text-red-700"
                      title="Remove Goal"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <Button type="button" variant="primary" onClick={addGoal}>
                  + Add Goal
                </Button>
              </div>

              {/* Meals Section */}
              <div>
                <h4 className="text-xl font-semibold mt-6 mb-2">Meals</h4>
                {carePlan.meals.map((meal, index) => (
                  <div key={index} className="mb-2 flex items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meal {index + 1}
                      </label>
                      <select
                        value={meal}
                        onChange={(e) =>
                          handleMealChange(index, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Select Meal</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snacks">Snacks</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMeal(index)}
                      className="text-red-500 text-xl font-bold px-2 hover:text-red-700"
                      title="Remove Meal"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <Button type="button" variant="primary" onClick={addMeal}>
                  + Add Meal
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button variant="outline" onClick={() => onClose()}>
                  Close
                </Button>
                <Button variant="primary" type="submit">
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddCarePlanModal;
