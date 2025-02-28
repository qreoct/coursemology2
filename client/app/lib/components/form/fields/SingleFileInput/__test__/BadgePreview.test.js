import { mount } from 'enzyme';
import BadgePreview from '../BadgePreview';

describe('<SingleFileInput />', () => {
  it('renders with url and name', () => {
    const badgePreview = mount(
      <BadgePreview originalName="bar" originalUrl="foo" />,
      buildContextOptions(),
    );

    const avatar = badgePreview.find('ForwardRef(Avatar)').first();
    expect(badgePreview.find('.file-name').text()).toContain('bar');
    expect(avatar.prop('src')).toBe('foo');
    expect(avatar.prop('icon')).toBeUndefined();
  });

  it('renders a placeholder when no url is provided', () => {
    const badgePreview = mount(<BadgePreview />, buildContextOptions());

    const avatar = badgePreview.find('ForwardRef(Avatar)').first();
    // SvgIcon is the element of the placeholder 'InsertDriveFileIcon'
    expect(avatar.find('ForwardRef(SvgIcon)')).toHaveLength(1);
    // No img element is rendered
    expect(avatar.find('img')).toHaveLength(0);
  });
});
