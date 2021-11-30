# frozen_string_literal: true
class Course::StatisticsController < Course::ComponentController
  before_action :authorize_read_statistics!

  def student
    preload_levels
    course_users = current_course.course_users.includes(:groups)
    staff = course_users.staff
    all_students = course_users.students.ordered_by_experience_points.with_video_statistics
    @phantom_students, @students = all_students.partition(&:phantom?)
    @service = Course::GroupManagerPreloadService.new(staff)
  end

  def staff
    @staffs = current_course.course_users.teaching_assistant_and_manager
    @staffs = CourseUser.order_by_average_marking_time(@staffs)
  end

  def all_submissions
    respond_to do |format|
      format.html {}
      format.json do
        @assessments = current_course.assessments.calculated(:maximum_grade).includes([{tab: :category}])
        @submissions = Course::Assessment::Submission.where('assessment_id IN (?)', @assessments.pluck(:id)).calculated(:log_count, :graded_at).includes(:answers, {assessment: :questions})
        @course_users = current_course.course_users.students.order_phantom_user.order_alphabetically.includes(:user)
      end
    end
  end

  private

  def authorize_read_statistics!
    authorize!(:read_statistics, current_course)
  end

  # Pre-loads course levels to avoid N+1 queries when course_user.level_numbers are displayed.
  def preload_levels
    current_course.levels.to_a
  end

  # @return [Course::StatisticsComponent]
  # @return [nil] If component is disabled.
  def component
    current_component_host[:course_statistics_component]
  end
end
