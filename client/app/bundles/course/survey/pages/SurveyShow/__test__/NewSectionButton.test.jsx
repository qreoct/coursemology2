import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import CourseAPI from 'api/course';
import storeCreator from 'course/survey/store';
import SectionFormDialogue from 'course/survey/containers/SectionFormDialogue';
import NewSectionButton from '../NewSectionButton';

describe('<NewSectionButton />', () => {
  it('injects handlers that allow survey sections to be created', async () => {
    const spyCreate = jest.spyOn(CourseAPI.survey.sections, 'create');
    const contextOptions = buildContextOptions(storeCreator({}));
    const newSectionButton = mount(<NewSectionButton />, contextOptions);
    const sectionFormDialogue = mount(<SectionFormDialogue />, contextOptions);

    // Click 'new section' button
    newSectionButton.find('button').simulate('click');
    sectionFormDialogue.update();
    expect(
      sectionFormDialogue.find('SectionFormDialogue').first().props().visible,
    ).toBe(true);

    // Fill section form with title
    const section = { title: 'Funky section title', description: '' };
    const sectionForm = sectionFormDialogue.find('form');
    const titleInput = sectionForm.find('input[name="title"]');
    titleInput.simulate('change', { target: { value: section.title } });

    // Submit section form
    await act(async () => {
      sectionForm.simulate('submit');
    });
    expect(spyCreate).toHaveBeenCalledWith({ section });
  });
});
