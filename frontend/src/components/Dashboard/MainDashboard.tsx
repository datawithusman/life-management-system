import React from 'react';
import '../../styles/maindashboard.css';

interface MainDashboardProps {
  data: any;
}

function MainDashboard({ data }: MainDashboardProps) {
  return (
    <div className="main-dashboard">
      <h1 className="page-title">📊 Dashboard Overview</h1>

      {/* Overview Cards */}
      <div className="overview-grid">
        <div className="overview-card study-card">
          <div className="card-icon">📚</div>
          <h3>Today's Study</h3>
          <p className="big-number">{data.todayOverview?.studyHours || 0}h</p>
          <p className="card-label">Hours Studied</p>
        </div>

        <div className="overview-card expense-card">
          <div className="card-icon">💰</div>
          <h3>Today's Expenses</h3>
          <p className="big-number">${data.todayOverview?.expenseAmount || 0}</p>
          <p className="card-label">Amount Spent</p>
        </div>

        <div className="overview-card task-card">
          <div className="card-icon">✅</div>
          <h3>Today's Tasks</h3>
          <p className="big-number">
            {data.todayOverview?.tasksCompleted || 0}/{data.todayOverview?.tasksCount || 0}
          </p>
          <p className="card-label">Tasks Completed</p>
        </div>

        <div className="overview-card islamic-card">
          <div className="card-icon">🕌</div>
          <h3>Islamic Practices</h3>
          <p className="big-number">{data.todayOverview?.islamicPracticesCount || 0}</p>
          <p className="card-label">Practices Today</p>
        </div>
      </div>

      {/* Study Goals Progress */}
      {data.studyTracking?.goals && data.studyTracking.goals.length > 0 && (
        <section className="dashboard-section">
          <h2 className="section-title">📖 Study Goals Progress</h2>
          <div className="goals-list">
            {data.studyTracking.goals.map((goal: any, idx: number) => (
              <div key={idx} className="goal-item">
                <div className="goal-info">
                  <span className="goal-subject">{goal.subject}</span>
                  <span className="goal-percentage">{Math.round(goal.completionPercentage)}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${goal.completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pending Tasks */}
      {data.tasks?.pending && data.tasks.pending.length > 0 && (
        <section className="dashboard-section">
          <h2 className="section-title">📋 Today's Pending Tasks</h2>
          <div className="tasks-list">
            {data.tasks.pending.slice(0, 5).map((task: any, idx: number) => (
              <div key={idx} className="task-item">
                <span className="task-title">{task.title}</span>
                <span className={`priority-badge priority-${task.priority}`}>
                  {task.priority.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {data.professional?.upcomingEvents && data.professional.upcomingEvents.length > 0 && (
        <section className="dashboard-section">
          <h2 className="section-title">📅 Upcoming Events</h2>
          <div className="events-list">
            {data.professional.upcomingEvents.slice(0, 5).map((event: any, idx: number) => (
              <div key={idx} className="event-item">
                <span className="event-name">{event.name}</span>
                <span className="event-location">{event.location}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Active Courses */}
      {data.business?.activeCourses && data.business.activeCourses.length > 0 && (
        <section className="dashboard-section">
          <h2 className="section-title">💻 Active Courses</h2>
          <div className="courses-list">
            {data.business.activeCourses.map((course: any, idx: number) => (
              <div key={idx} className="course-item">
                <div className="course-info">
                  <span className="course-name">{course.name}</span>
                  <span className="course-platform">{course.platform}</span>
                </div>
                <div className="course-progress">
                  <span className="progress-percentage">{course.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Health Status */}
      {data.health && (
        <section className="dashboard-section">
          <h2 className="section-title">❤️ Health Status</h2>
          <div className="health-grid">
            {data.health.latestWorkout && (
              <div className="health-item">
                <h4>Latest Workout</h4>
                <p>{data.health.latestWorkout.type} - {data.health.latestWorkout.duration} mins</p>
              </div>
            )}
            {data.health.latestMetric && (
              <div className="health-item">
                <h4>Health Metrics</h4>
                <p>Weight: {data.health.latestMetric.weight || 'N/A'} kg</p>
                <p>Heart Rate: {data.health.latestMetric.heartRate || 'N/A'} bpm</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Network Connections Needing Follow-up */}
      {data.network?.connectionsNeedingFollowUp > 0 && (
        <section className="dashboard-section alert-section">
          <h2 className="section-title">⚠️ Action Items</h2>
          <div className="action-items">
            <div className="action-item">
              🤝 <strong>{data.network.connectionsNeedingFollowUp}</strong> connections need follow-up
            </div>
            {data.professional?.pendingPosts > 0 && (
              <div className="action-item">
                📝 <strong>{data.professional.pendingPosts}</strong> LinkedIn posts pending
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default MainDashboard;
