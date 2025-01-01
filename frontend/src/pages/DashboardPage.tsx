import React, { useState } from 'react';
import Dashboard from '../components/Dashboard/Dashboard';
import DashboardOverview from '../components/Dashboard/DashboardOverview';
import AddGame from '../components/Dashboard/AddGame';
import ViewGames from '../components/Dashboard/ViewGames';
import AddGameFiles from '../components/Dashboard/AddGameFiles';

const DashboardPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'addGame':
        return <AddGame />;
      case 'myGames':
        return <ViewGames />;
      case 'gameFiles':
        return <AddGameFiles />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <Dashboard
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      {renderActiveSection()}
    </Dashboard>
  );
};

export default DashboardPage;

