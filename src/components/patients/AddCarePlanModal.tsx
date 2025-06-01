import React, { useEffect, useState } from "react";
import { allMealPlans, carePlans } from "../../data/mockData";
// import { CarePlan } from "../../types";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface AddCarePlanModalProps {
  showModal: boolean;
  onClose: () => void;
}

const AddCarePlanModal: React.FC<AddCarePlanModalProps> = ({
  showModal,
  onClose,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedMealPlanId, setSelectedMealPlanId] = useState("");
  const [expandedPlans, setExpandedPlans] = useState<string[]>([]);

  const [selectedMealsByPlan, setSelectedMealsByPlan] = useState<Record<string, Set<string>>>({})

  const [carePlan, setCarePlan] = useState({
    name: "",
    plan: "",
    startDate: "",
    endDate: "",
    description: "",
    goals: [{ goal: "", targetDate: "" }],
    meals: [] as string[],
  });

  useEffect(() => {
  if (showModal) {
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
    setSelectedMealPlanId("");
    setExpandedPlans([]);
  }
}, [showModal]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCarePlan((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoalChange = (index: number, field: "goal" | "targetDate", value: string) => {
    const updatedGoals = [...carePlan.goals];
    updatedGoals[index] = { ...updatedGoals[index], [field]: value };
    setCarePlan((prev) => ({ ...prev, goals: updatedGoals }));
  };

  const addGoal = () =>
    setCarePlan((prev) => ({
      ...prev,
      goals: [...prev.goals, { goal: "", targetDate: "" }],
    }));

  const removeGoal = (index: number) =>
    setCarePlan((prev) => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }));

  const toggleMealPlan = (id: string) => {
    setExpandedPlans((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const addMealPlan = (planId: string) => {
    setCarePlan((prev) => ({
      ...prev,
      meals: [...prev.meals, planId],
    }));

    const mealIds = new Set(
      allMealPlans.find((p) => p.id === planId)?.meals.map((m) => m.id) || []
    );
    setSelectedMealsByPlan((prev) => ({
      ...prev,
      [planId]: mealIds,
    }));

    setExpandedPlans((prev) => [...prev, planId]);
  };

  const removeMealPlan = (planId: string) => {
    setCarePlan((prev) => ({
      ...prev,
      meals: prev.meals.filter((id) => id !== planId),
    }));
    setExpandedPlans((prev) => prev.filter((id) => id !== planId));
    setSelectedMealsByPlan((prev) => {
      const updated = { ...prev };
      delete updated[planId];
      return updated;
    });
  };

  const toggleMealSelection = (planId: string, mealId: string) => {
    setSelectedMealsByPlan((prev) => {
      const currentMeals = new Set(prev[planId] || []);
      if (currentMeals.has(mealId)) {
        currentMeals.delete(mealId);
      } else {
        currentMeals.add(mealId);
      }
      return {
        ...prev,
        [planId]: currentMeals,
      };
    });
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedPlanId(selectedId);

    const selected = carePlans.find((plan) => plan.id === selectedId);
    if (selected) {
      setCarePlan({
        ...carePlan,
        plan: selected.title,
        startDate: "",
        endDate: "",
        description: selected.description,
        goals: selected.goals.map((g) => ({
          goal: g.description,
          targetDate: g.targetDate.split("T")[0],
        })),
        meals: selected.meals.map((m) => m.id),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here (e.g., API call or state update)
    // alert("Care plan added!");
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
    setExpandedPlans([]);
    onClose();
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
            <label className="mb-2 font-medium">Select Care Plan</label>
            <select
              value={selectedPlanId}
              onChange={handlePlanChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select a Care Plan</option>
              {carePlans.map((item) => (
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

          {/* Goals Section */}
         {selectedPlanId !=""&& <>
          <div>
            <h4 className="text-xl font-semibold mt-6 mb-2">Goals</h4>
            {carePlan.goals.map((goal, idx) => (
              <div key={idx} className="flex gap-4 items-end mb-2">
                <Input
                  value={goal.goal}
                  onChange={(e) => handleGoalChange(idx, "goal", e.target.value)}
                  fullWidth
                  className="mt-1"
                />
                <Input
                  label="Target Date"
                  type="date"
                  value={goal.targetDate}
                  onChange={(e) => handleGoalChange(idx, "targetDate", e.target.value)}
                  fullWidth
                />
                <button
                  type="button"
                  onClick={() => removeGoal(idx)}
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

            {carePlan.meals.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No meals selected in this care plan.
                <div className="mt-4 flex justify-center items-center gap-4">
                  <select
                    value={selectedMealPlanId}
                    onChange={(e) => setSelectedMealPlanId(e.target.value)}
                    className="border px-3 py-2 rounded-md"
                  >
                    <option value="">Select Meal Plan</option>
                    {allMealPlans
                      .filter((plan) => !carePlan.meals.includes(plan.id))
                      .map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name}
                        </option>
                      ))}
                  </select>
                  <Button
                    disabled={!selectedMealPlanId}
                    onClick={() => {
                      addMealPlan(selectedMealPlanId);
                      setSelectedMealPlanId("");
                    }}
                  >
                    Add Meal Plan
                  </Button>
                </div>
              </div>
            )}

            {carePlan.meals.length > 0 && (
              <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
                {carePlan.meals
                  .map((id) => allMealPlans.find((plan) => plan.id === id))
                  .filter(Boolean)
                  .map((plan) => (
                    <div
                      key={plan!.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="flex justify-between items-center p-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{plan!.name}</h4>
                          <p className="text-sm text-gray-600">{plan!.description}</p>
                          <Badge variant="info" className="mt-1">{plan!.schedule}</Badge>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            type="button"
                            onClick={() => toggleMealPlan(plan!.id)}
                          >
                            {expandedPlans.includes(plan!.id) ? "Hide Meals" : "Show Meals"}
                          </Button>
                          <Button
                            size="sm"
                            type="button"
                            variant="danger"
                            onClick={() => removeMealPlan(plan!.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>

                      {expandedPlans.includes(plan!.id) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-0">
                          {plan!.meals.map((meal) => {
                            const isSelected = selectedMealsByPlan[plan!.id]?.has(meal.id);
                            return (
                              <div
                                key={meal.id}
                                className={`flex border rounded-lg overflow-hidden ${
                                  isSelected ? "border-blue-500" : "border-gray-200"
                                }`}
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
                                  <div className="flex justify-between items-center">
                                    <h6 className="font-medium text-gray-900">{meal.name}</h6>
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() =>
                                        toggleMealSelection(plan!.id, meal.id)
                                      }
                                    />
                                  </div>
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
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div></>}

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
