import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Download } from 'lucide-react';
import type { DietPlan, Meal, MealItem, PlanOption } from '../types';
import { foods } from '../data/foods';
import { getPlan, savePlan } from '../utils/storage';
import { calculateItemCalories, calculateMealCalories, calculateOptionCalories } from '../utils/calculations';
import { v4 as uuidv4 } from 'uuid';
import jsPDF from 'jspdf';
// @ts-ignore
import autoTable from 'jspdf-autotable';

import logo from '../assets/logo.png';

export const PlanEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [activeOptionId, setActiveOptionId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (id) {
      const existingPlan = getPlan(id);
      if (existingPlan) {
        setPlan(existingPlan);
        if (existingPlan.options.length > 0) {
          setActiveOptionId(existingPlan.options[0].id);
        }
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);

  const activeOption = plan?.options.find(o => o.id === activeOptionId);

  const handleAddOption = () => {
    if (!plan) return;
    const newOption: PlanOption = {
      id: uuidv4(),
      name: `Option ${plan.options.length + 1}`,
      meals: []
    };
    const updatedPlan = { ...plan, options: [...plan.options, newOption] };
    setPlan(updatedPlan);
    savePlan(updatedPlan);
    setActiveOptionId(newOption.id);
  };

  const handleDeleteOption = (e: React.MouseEvent, optionId: string) => {
    e.stopPropagation();
    if (!plan || plan.options.length <= 1) return;
    if (!confirm('Delete this option?')) return;

    const updatedPlan = {
      ...plan,
      options: plan.options.filter(o => o.id !== optionId)
    };
    setPlan(updatedPlan);
    savePlan(updatedPlan);
    if (activeOptionId === optionId) {
      setActiveOptionId(updatedPlan.options[0].id);
    }
  };

  const handleAddMeal = () => {
    if (!plan || !activeOptionId) return;
    const newMeal: Meal = {
      id: uuidv4(),
      name: `Meal ${activeOption?.meals.length ? activeOption.meals.length + 1 : 1}`,
      items: []
    };
    
    const updatedPlan = {
      ...plan,
      options: plan.options.map(opt => {
        if (opt.id === activeOptionId) {
          return { ...opt, meals: [...opt.meals, newMeal] };
        }
        return opt;
      })
    };
    setPlan(updatedPlan);
    savePlan(updatedPlan);
  };

  const handleDeleteMeal = (mealId: string) => {
    if (!plan || !activeOptionId) return;
    const updatedPlan = {
      ...plan,
      options: plan.options.map(opt => {
        if (opt.id === activeOptionId) {
          return { ...opt, meals: opt.meals.filter(m => m.id !== mealId) };
        }
        return opt;
      })
    };
    setPlan(updatedPlan);
    savePlan(updatedPlan);
  };

  const handleAddFood = (mealId: string, foodName: string) => {
    if (!plan || !activeOptionId) return;
    const food = foods.find(f => f.name === foodName);
    if (!food) return;

    const newItem: MealItem = {
      id: uuidv4(),
      food,
      quantity: 1
    };

    const updatedPlan = {
      ...plan,
      options: plan.options.map(opt => {
        if (opt.id === activeOptionId) {
          return {
            ...opt,
            meals: opt.meals.map(meal => {
              if (meal.id === mealId) {
                return { ...meal, items: [...meal.items, newItem] };
              }
              return meal;
            })
          };
        }
        return opt;
      })
    };
    setPlan(updatedPlan);
    savePlan(updatedPlan);
  };

  const handleUpdateQuantity = (mealId: string, itemId: string, quantity: number) => {
    if (!plan || !activeOptionId || quantity < 0) return;
    const updatedPlan = {
      ...plan,
      options: plan.options.map(opt => {
        if (opt.id === activeOptionId) {
          return {
            ...opt,
            meals: opt.meals.map(meal => {
              if (meal.id === mealId) {
                return {
                  ...meal,
                  items: meal.items.map(item => {
                    if (item.id === itemId) {
                      return { ...item, quantity };
                    }
                    return item;
                  })
                };
              }
              return meal;
            })
          };
        }
        return opt;
      })
    };
    setPlan(updatedPlan);
    savePlan(updatedPlan);
  };

  const handleRemoveItem = (mealId: string, itemId: string) => {
    if (!plan || !activeOptionId) return;
    const updatedPlan = {
      ...plan,
      options: plan.options.map(opt => {
        if (opt.id === activeOptionId) {
          return {
            ...opt,
            meals: opt.meals.map(meal => {
              if (meal.id === mealId) {
                return {
                  ...meal,
                  items: meal.items.filter(item => item.id !== itemId)
                };
              }
              return meal;
            })
          };
        }
        return opt;
      })
    };
    setPlan(updatedPlan);
    savePlan(updatedPlan);
  };

  const handleExportPDF = () => {
    if (!plan) return;
    setIsExporting(true);

    const doc = new jsPDF();
    const img = new Image();
    img.src = logo;

    img.onload = () => {
      // Logo
      const imgWidth = 40;
      const imgHeight = (img.height * imgWidth) / img.width;
      doc.addImage(img, 'PNG', 14, 10, imgWidth, imgHeight);

      // Header
      doc.setFontSize(22);
      doc.text(plan.name, 14, imgHeight + 20);
      doc.setFontSize(10);
      doc.text(`Created: ${new Date(plan.createdAt).toLocaleDateString()}`, 14, imgHeight + 30);
      
      let yPos = imgHeight + 40;

      // Plan Note
      if (plan.note) {
        doc.setFontSize(10);
        doc.setTextColor(100);
        const splitNote = doc.splitTextToSize(plan.note, 180);
        doc.text(splitNote, 14, yPos);
        yPos += (splitNote.length * 5) + 5;
        doc.setTextColor(0);
      }

      plan.options.forEach((option) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(18);
        doc.setTextColor(14, 165, 233); // Sky blue
        doc.text(`${option.name} (Total: ${calculateOptionCalories(option).toFixed(0)} kcal)`, 14, yPos);
        doc.setTextColor(0, 0, 0); // Reset color
        yPos += 10;

        // Option Note
        if (option.note) {
          doc.setFontSize(10);
          doc.setTextColor(100);
          const splitNote = doc.splitTextToSize(option.note, 180);
          doc.text(splitNote, 14, yPos);
          yPos += (splitNote.length * 5) + 5;
          doc.setTextColor(0);
        }

        option.meals.forEach((meal) => {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFontSize(14);
          doc.text(`${meal.name} (${calculateMealCalories(meal).toFixed(0)} kcal)`, 14, yPos);
          yPos += 5;

          // Meal Note
          if (meal.note) {
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Note: ${meal.note}`, 14, yPos);
            yPos += 5;
            doc.setTextColor(0);
          }

          const tableData = meal.items.map(item => {
            let quantityText = '';
            if (item.food.unit === '100g') {
              quantityText = `${(item.quantity * 100).toFixed(0)}g`;
            } else if (item.food.unit === 'piece') {
              quantityText = `${item.quantity}`;
            } else {
              quantityText = `${item.quantity} x ${item.food.unit}`;
            }

            return [
              item.food.name,
              quantityText,
              `${calculateItemCalories(item).toFixed(0)} kcal`
            ];
          });

          autoTable(doc, {
            startY: yPos,
            head: [['Food', 'Quantity', 'Calories']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [14, 165, 233] },
            margin: { left: 14 },
          });

          // @ts-ignore
          yPos = doc.lastAutoTable.finalY + 15;
        });
        
        yPos += 10; // Space between options
      });

      doc.save(`${plan.name.replace(/\s+/g, '_')}.pdf`);
      setIsExporting(false);
    };

    img.onerror = () => {
      console.error("Failed to load logo");
      setIsExporting(false);
      alert("Failed to load logo for PDF export.");
    };
  };

  if (!plan) return null;

  return (
    <div className="animate-fade-in">
      <div className="editor-nav">
        <button onClick={() => navigate('/')} className="back-link">
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <button onClick={handleExportPDF} disabled={isExporting} className="btn btn-secondary">
          <Download size={18} />
          {isExporting ? 'Exporting...' : 'Export PDF'}
        </button>
      </div>

      <div className="plan-summary">
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={plan.name}
            onChange={(e) => {
              const updated = { ...plan, name: e.target.value };
              setPlan(updated);
              savePlan(updated);
            }}
            className="plan-name-input"
          />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Created: {new Date(plan.createdAt).toLocaleDateString()}
          </p>
          <textarea
            value={plan.note || ''}
            onChange={(e) => {
              const updated = { ...plan, note: e.target.value };
              setPlan(updated);
              savePlan(updated);
            }}
            placeholder="Add a general note for this plan..."
            className="input note-input"
            rows={2}
          />
        </div>
      </div>

      <div className="tabs-container">
        {plan.options.map((option) => (
          <div key={option.id} className="tab-actions">
            <button
              onClick={() => setActiveOptionId(option.id)}
              className={`tab-btn ${activeOptionId === option.id ? 'active' : ''}`}
            >
              {option.name}
            </button>
            {plan.options.length > 1 && (
              <button
                onClick={(e) => handleDeleteOption(e, option.id)}
                className="btn-icon btn-danger-icon"
                title="Delete Option"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        <button onClick={handleAddOption} className="btn btn-secondary">
          <Plus size={16} /> Option
        </button>
      </div>

      {activeOption && (
        <>
          <div className="plan-summary" style={{ marginBottom: '2rem', background: 'var(--bg-card)' }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={activeOption.name}
                onChange={(e) => {
                  const updatedPlan = {
                    ...plan,
                    options: plan.options.map(opt => 
                      opt.id === activeOption.id ? { ...opt, name: e.target.value } : opt
                    )
                  };
                  setPlan(updatedPlan);
                  savePlan(updatedPlan);
                }}
                className="plan-name-input"
                style={{ fontSize: '1.5rem' }}
              />
              <p className="total-calories">
                Option Calories: <span className="calories-value">{calculateOptionCalories(activeOption).toFixed(0)}</span> kcal
              </p>
              <textarea
                value={activeOption.note || ''}
                onChange={(e) => {
                  const updatedPlan = {
                    ...plan,
                    options: plan.options.map(opt => 
                      opt.id === activeOption.id ? { ...opt, note: e.target.value } : opt
                    )
                  };
                  setPlan(updatedPlan);
                  savePlan(updatedPlan);
                }}
                placeholder={`Add a note for ${activeOption.name}...`}
                className="input note-input"
                rows={2}
              />
            </div>
            <button onClick={handleAddMeal} className="btn btn-primary">
              <Plus size={20} />
              Add Meal
            </button>
          </div>

          <div className="meals-container">
            {activeOption.meals.map((meal) => (
              <div key={meal.id} className="meal-card">
                <div className="meal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        value={meal.name}
                        onChange={(e) => {
                          const updatedPlan = {
                            ...plan,
                            options: plan.options.map(opt => {
                              if (opt.id === activeOption.id) {
                                return {
                                  ...opt,
                                  meals: opt.meals.map(m => m.id === meal.id ? { ...m, name: e.target.value } : m)
                                };
                              }
                              return opt;
                            })
                          };
                          setPlan(updatedPlan);
                          savePlan(updatedPlan);
                        }}
                        className="meal-name-input"
                      />
                      <input
                        type="text"
                        value={meal.note || ''}
                        onChange={(e) => {
                          const updatedPlan = {
                            ...plan,
                            options: plan.options.map(opt => {
                              if (opt.id === activeOption.id) {
                                return {
                                  ...opt,
                                  meals: opt.meals.map(m => m.id === meal.id ? { ...m, note: e.target.value } : m)
                                };
                              }
                              return opt;
                            })
                          };
                          setPlan(updatedPlan);
                          savePlan(updatedPlan);
                        }}
                        placeholder="Add note..."
                        className="input"
                        style={{ fontSize: '0.9rem', marginTop: '0.5rem', width: '100%' }}
                      />
                    </div>
                    <span className="meal-calories-badge">
                      {calculateMealCalories(meal).toFixed(0)} kcal
                    </span>
                  </div>
                  <button onClick={() => handleDeleteMeal(meal.id)} className="btn-icon btn-danger-icon">
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="food-list">
                  {meal.items.map((item) => (
                    <div key={item.id} className="food-item">
                      <div className="food-info">
                        <div className="food-name">{item.food.name}</div>
                        <div className="food-meta">{item.food.calories} kcal / {item.food.unit}</div>
                      </div>
                      
                      <div className="food-controls">
                        <div className="quantity-input-group">
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(meal.id, item.id, parseFloat(e.target.value) || 0)}
                            className="quantity-input"
                          />
                          <div className="quantity-unit">
                            {item.food.unit}
                          </div>
                        </div>
                        
                        <div className="item-calories">
                          {calculateItemCalories(item).toFixed(0)} kcal
                        </div>

                        <button onClick={() => handleRemoveItem(meal.id, item.id)} className="btn-icon btn-danger-icon">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="input-group">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddFood(meal.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="input select add-food-select"
                  >
                    <option value="">+ Add Food to {meal.name}</option>
                    {foods.map(food => (
                      <option key={food.name} value={food.name}>
                        {food.name} ({food.calories} kcal / {food.unit})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}

            {activeOption.meals.length === 0 && (
              <div className="empty-state">
                <p style={{ marginBottom: '1rem' }}>Start by adding a meal to this option</p>
                <button onClick={handleAddMeal} className="btn btn-primary">
                  <Plus size={20} />
                  Add First Meal
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
