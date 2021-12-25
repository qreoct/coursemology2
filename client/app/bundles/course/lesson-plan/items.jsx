import { render } from 'react-dom';
import { Router } from 'react-router-dom';

import LessonPlanLayout from 'course/lesson-plan/containers/LessonPlanLayout';
import ProviderWrapper from 'lib/components/ProviderWrapper';
import history from 'lib/history';

import storeCreator from './store';

$(() => {
  const mountNode = document.getElementById('lesson-plan-items');

  if (mountNode) {
    const store = storeCreator();

    render(
      <ProviderWrapper {...{ store }}>
        <Router history={history}>
          <LessonPlanLayout />
        </Router>
      </ProviderWrapper>,
      mountNode,
    );
  }
});
