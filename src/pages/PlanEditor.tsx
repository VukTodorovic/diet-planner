import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Download } from 'lucide-react';
import type { DietPlan, Meal, MealItem, PlanOption } from '../types';
import { foods } from '../data/foods';
import { getPlan, savePlan } from '../utils/storage';
import { calculateItemCalories, calculateMealCalories, calculateOptionCalories, calculateItemMacros, calculateMealMacros, calculateOptionMacros } from '../utils/calculations';
import { calculateShoppingList } from '../utils/shoppingList';
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
        doc.text(option.name, 14, yPos);
        yPos += 8;
        
        doc.setFontSize(12);
        const optionMacros = calculateOptionMacros(option);
        doc.text(`Total: ${calculateOptionCalories(option).toFixed(0)} kcal - P: ${optionMacros.protein.toFixed(1)}g, C: ${optionMacros.carbs.toFixed(1)}g, F: ${optionMacros.fat.toFixed(1)}g`, 14, yPos);
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
          const mealMacros = calculateMealMacros(meal);
          doc.text(`${meal.name} (${calculateMealCalories(meal).toFixed(0)} kcal - P: ${mealMacros.protein.toFixed(1)}g, C: ${mealMacros.carbs.toFixed(1)}g, F: ${mealMacros.fat.toFixed(1)}g)`, 14, yPos);
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

            const macros = calculateItemMacros(item);
            return [
              item.food.name,
              quantityText,
              `${calculateItemCalories(item).toFixed(0)} kcal`,
              `${macros.protein.toFixed(1)}g`,
              `${macros.carbs.toFixed(1)}g`,
              `${macros.fat.toFixed(1)}g`
            ];
          });

          autoTable(doc, {
            startY: yPos,
            head: [['Food', 'Quantity', 'Calories', 'Protein', 'Carbs', 'Fat']],
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

      // Shopping Summary
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(18);
      doc.setTextColor(14, 165, 233); // Sky blue
      doc.text('Shopping Summary', 14, yPos);
      doc.setTextColor(0, 0, 0); // Reset color
      yPos += 10;

      const shoppingList = calculateShoppingList(plan);
      const shoppingTableData = shoppingList.map(item => {
        let quantityText = '';
        if (item.food.unit === '100g') {
          quantityText = `${(item.totalQuantity * 100).toFixed(0)}g`;
        } else if (item.food.unit === 'piece') {
          quantityText = `${item.totalQuantity}`;
        } else {
          quantityText = `${item.totalQuantity} x ${item.food.unit}`;
        }
        
        return [
          item.food.name, 
          quantityText
        ];
      });

      autoTable(doc, {
        startY: yPos,
        head: [['Food', 'Total Quantity']],
        body: shoppingTableData,
        theme: 'striped',
        headStyles: { fillColor: [14, 165, 233] },
        margin: { left: 14 },
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
                <span className="macros-summary" style={{ marginLeft: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  (P: {calculateOptionMacros(activeOption).protein.toFixed(1)}g, 
                   C: {calculateOptionMacros(activeOption).carbs.toFixed(1)}g, 
                   F: {calculateOptionMacros(activeOption).fat.toFixed(1)}g)
                </span>
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
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span className="meal-calories-badge">
                        {calculateMealCalories(meal).toFixed(0)} kcal
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        P: {calculateMealMacros(meal).protein.toFixed(1)}g C: {calculateMealMacros(meal).carbs.toFixed(1)}g F: {calculateMealMacros(meal).fat.toFixed(1)}g
                      </span>
                    </div>
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
                        <div className="food-meta">
                          {item.food.calories} kcal / {item.food.unit}
                          <span style={{ marginLeft: '0.5rem', color: 'var(--text-secondary)' }}>
                            (P: {item.food.protein}g C: {item.food.carbs}g F: {item.food.fat}g)
                          </span>
                        </div>
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
                        
                        <div className="item-calories" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span>{calculateItemCalories(item).toFixed(0)} kcal</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                            P: {calculateItemMacros(item).protein.toFixed(1)}g
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                            C: {calculateItemMacros(item).carbs.toFixed(1)}g
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                            F: {calculateItemMacros(item).fat.toFixed(1)}g
                          </span>
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
                        {food.name} ({food.calories} kcal / {food.unit}) - P: {food.protein}g C: {food.carbs}g F: {food.fat}g
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

      {plan.options.length > 0 && (
        <div className="plan-summary" style={{ marginTop: '2rem', background: 'var(--bg-card)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Shopping Summary</h3>
          <div className="shopping-list">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Food</th>
                  <th style={{ textAlign: 'right', padding: '0.5rem' }}>Total Quantity</th>
                </tr>
              </thead>
              <tbody>
                {calculateShoppingList(plan).map((item, index) => {
                  return (
                  <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.5rem' }}>{item.food.name}</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                      {item.food.unit === '100g' 
                        ? `${(item.totalQuantity * 100).toFixed(0)}g`
                        : item.food.unit === 'piece'
                          ? `${item.totalQuantity}`
                          : `${item.totalQuantity} x ${item.food.unit}`
                      }
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
