import React, { useState } from "react";
import { carePlans, allMealPlans } from "../../data/mockData"; // ✅ assumed allMealPlans is imported
import { CarePlan } from "../../types";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Badge from "../ui/Badge"; // ✅ assumed a Badge UI component exists

interface AddCarePlanModalProps {
  showModal: boolean;
  onClose: () => void;
}

const AddCarePlanModal: React.FC<AddCarePlanModalProps> = ({ showModal, onClose }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [expandedPlans, setExpandedPlans] = useState<string[]>([]);

  const [carePlan, setCarePlan] = useState({
    name: "",
    plan: "",
    startDate: "",
    endDate: "",
    description: "",
    goals: [{ goal: "", targetDate: "" }],
    meals: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Care plan added!");
    setCarePlan({
      name: "",
      plan: "",
      startDate: "",
      endDate: "",
      description: "",
      goals: [{ goal: "", targetDate: "" }],
      meals: [],
    });
    setSelectedPlanId("");
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCarePlan({ ...carePlan, [name]: value });
  };

  const handleGoalChange = (index: number, field: "goal" | "targetDate", value: string) => {
    const updatedGoals = [...carePlan.goals];
    updatedGoals[index] = { ...updatedGoals[index], [field]: value };
    setCarePlan({ ...carePlan, goals: updatedGoals });
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

  const toggleMealPlan = (id: string) => {
    setExpandedPlans((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const removeMealPlan = (id: string) => {
    setCarePlan((prev) => ({
      ...prev,
      meals: prev.meals.filter((mealId) => mealId !== id),
    }));
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedPlanId(selectedId);

    const selectedPlan = carePlans.find((plan) => plan.id === selectedId);
    if (selectedPlan) {
      setCarePlan({
        ...carePlan,
        startDate: selectedPlan.startDate.split("T")[0],
        endDate: selectedPlan.endDate.split("T")[0],
        goals: selectedPlan.goals.map((goal) => ({
          goal: goal.description,
          targetDate: goal.targetDate.split("T")[0],
        })),
        meals: selectedPlan.meals.map((mealGroup) => mealGroup.id), // assuming mealGroup.id = mealPlanId
      });
    }
  };

  return showModal ? (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Add Care Plan</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-4 pb-0 text-xl">
          <span>Patient Name: </span>
          <span>John Doe</span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col">
            <label className="mb-2">Select Care Plan</label>
            <select
              value={selectedPlanId}
              onChange={handlePlanChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select a Care Plan</option>
              {carePlans.map((item: CarePlan) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
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

          {/* Goals */}
          <div>
            <h4 className="text-xl font-semibold mt-6 mb-2">Goals</h4>
            {carePlan.goals.map((goal, index) => (
              <div key={index} className="flex gap-4 items-end mb-2">
                <Input
                  label="Goal"
                  value={goal.goal}
                  onChange={(e) => handleGoalChange(index, "goal", e.target.value)}
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

          {/* Meals */}
          <div>
            <h4 className="text-xl font-semibold mt-6 mb-2">Meals</h4>
            <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
              {carePlan.meals.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No meals selected in this care plan
                </div>
              ) : (
                carePlan.meals
                  .map((mealPlanId) => allMealPlans.find((plan) => plan.id === mealPlanId))
                  .filter(Boolean)
                  .map((mealPlan) => (
                    <div
                      key={mealPlan!.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="flex justify-between items-center p-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{mealPlan!.name}</h4>
                          <p className="text-sm text-gray-600">{mealPlan!.description}</p>
                          <Badge variant="info" className="mt-1">
                            {mealPlan!.schedule}
                          </Badge>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleMealPlan(mealPlan!.id)}
                          >
                            {expandedPlans.includes(mealPlan!.id) ? "Hide Meals" : "Show Meals"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeMealPlan(mealPlan!.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>

                      {expandedPlans.includes(mealPlan!.id) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-0">
                          {mealPlan!.meals.map((meal) => (
                            <div
                              key={meal.id}
                              className="flex border border-gray-200 rounded-lg overflow-hidden"
                            >
                              {meal.image && (
                                <div className="w-24 h-24 flex-shrink-0">
                                  <img
                                    src={meal.image}
                                    alt={meal.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="p-3 flex-1">
                                <h6 className="font-medium text-gray-900">{meal.name}</h6>
                                <p className="text-xs text-gray-600 mt-1">{meal.description}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <span className="inline-flex text-xs bg-blue-50 text-blue-700 rounded px-2 py-0.5">
                                    {meal.nutritionalInfo?.calories} cal
                                  </span>
                                  <span className="inline-flex text-xs bg-green-50 text-green-700 rounded px-2 py-0.5">
                                    {meal.nutritionalInfo?.protein}g protein
                                  </span>
                                  <span className="inline-flex text-xs bg-yellow-50 text-yellow-700 rounded px-2 py-0.5">
                                    {meal.nutritionalInfo?.carbs}g carbs
                                  </span>
                                  <span className="inline-flex text-xs bg-red-50 text-red-700 rounded px-2 py-0.5">
                                    {meal.nutritionalInfo?.fat}g fat
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default AddCarePlanModal;
