import React from 'react';
import { Tab } from '@headlessui/react';
import LuckyCardRoll from '../cards/LuckyCardRoll';
import { FaDice, FaCalendarAlt, FaTasks } from 'react-icons/fa';
import useDailyTaskStore from '../../store/dailyTaskStore';
import StarDisplay from '../shared/StarDisplay';
import { JobSystem } from './jobs/JobSystem';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const TasksAndJobs = () => {
  const { currentDailyCard } = useDailyTaskStore();

  const tabs = [
    {
      name: 'Lucky Roll',
      icon: FaDice,
      content: <LuckyCardRoll />
    },
    {
      name: 'Daily Tasks',
      icon: FaCalendarAlt,
      content: (
        <div className="p-4">
          <h3 className="text-xl font-bold text-purple-300 mb-4">Daily Tasks</h3>
          {currentDailyCard ? (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-white">{currentDailyCard.name}</h4>
                <StarDisplay count={currentDailyCard.starRank} />
              </div>
              <p className="text-gray-400 mb-4">{currentDailyCard.description}</p>
              {/* Add daily task completion UI here */}
            </div>
          ) : (
            <p className="text-gray-400">No daily task available. Check back tomorrow!</p>
          )}
        </div>
      )
    },
    {
      name: 'Jobs',
      icon: FaTasks,
      content: (
        <div className="p-4">
          <h3 className="text-xl font-bold text-purple-300 mb-4">Available Jobs</h3>
          <JobSystem />
        </div>
      )
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-800 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow'
                    : 'text-gray-400 hover:bg-gray-700/30 hover:text-white'
                )
              }
            >
              <div className="flex items-center justify-center gap-2">
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </div>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                'rounded-xl bg-gray-900 p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2'
              )}
            >
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default TasksAndJobs;
