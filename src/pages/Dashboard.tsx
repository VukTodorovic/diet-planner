import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Calendar, Trash2, ChevronRight } from 'lucide-react';
import type { DietPlan } from '../types';
import { getPlans, savePlan, deletePlan } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

export const Dashboard: React.FC = () => {
  const [plans, setPlans] = useState<DietPlan[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setPlans(getPlans());
  }, []);

  const handleCreatePlan = () => {
    const newPlan: DietPlan = {
      id: uuidv4(),
      name: `Diet Plan ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
      options: [
        {
          id: uuidv4(),
          name: 'Option 1',
          meals: []
        }
      ]
    };
    savePlan(newPlan);
    navigate(`/plan/${newPlan.id}`);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this plan?')) {
      deletePlan(id);
      setPlans(getPlans());
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">My Diet Plans</h1>
          <p className="page-subtitle">Manage your daily nutrition and meal plans</p>
        </div>
        <button onClick={handleCreatePlan} className="btn btn-primary">
          <Plus size={20} />
          New Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="empty-state">
          <div className="plan-icon" style={{ margin: '0 auto 1rem', width: '64px', height: '64px' }}>
            <Calendar size={32} />
          </div>
          <h3 className="plan-title">No plans yet</h3>
          <p className="page-subtitle" style={{ marginBottom: '1.5rem' }}>Create your first diet plan to get started</p>
          <button onClick={handleCreatePlan} className="btn btn-primary">
            Create Plan
          </button>
        </div>
      ) : (
        <div className="plans-grid">
          {plans.map((plan) => (
            <Link
              key={plan.id}
              to={`/plan/${plan.id}`}
              className="card plan-card"
            >
              <div className="plan-card-header">
                <div className="plan-icon">
                  <Calendar size={24} />
                </div>
                <button
                  onClick={(e) => handleDelete(e, plan.id)}
                  className="btn-icon btn-danger-icon"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <h3 className="plan-title">
                {plan.name}
              </h3>
              <p className="plan-date">
                Created {new Date(plan.createdAt).toLocaleDateString()}
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', color: 'var(--accent-primary)', fontWeight: 500, fontSize: '0.9rem' }}>
                View Plan <ChevronRight size={16} style={{ marginLeft: '0.25rem' }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
