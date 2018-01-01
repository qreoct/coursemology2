# frozen_string_literal: true
class Course::Video < ApplicationRecord
  acts_as_lesson_plan_item has_todo: true

  include Course::ReminderConcern
  include Course::Video::UrlConcern

  has_many :submissions, class_name: Course::Video::Submission.name,
                         inverse_of: :video, dependent: :destroy
  has_many :topics, class_name: Course::Video::Topic.name,
                    dependent: :destroy, foreign_key: :video_id, inverse_of: :video

  scope :from_course, ->(course) { where(course_id: course) }

  # TODO: Refactor this together with assessments.
  # @!method self.ordered_by_date_and_title
  #   Orders the videos by the starting date and title.
  scope :ordered_by_date_and_title, (lambda do
    select('course_videos.*, course_lesson_plan_items.start_at, course_lesson_plan_items.title').
      joins(:lesson_plan_item).
      merge(Course::LessonPlan::Item.ordered_by_date_and_title)
  end)

  # @!method with_submissions_by(creator)
  #   Includes the submissions by the provided user.
  #   @param [User] user The user to preload submissions for.
  scope :with_submissions_by, (lambda do |user|
    submissions = Course::Video::Submission.by_user(user).
      where(video: distinct(false).pluck(:id))

    all.to_a.tap do |result|
      preloader = ActiveRecord::Associations::Preloader::ManualPreloader.new
      preloader.preload(result, :submissions, submissions)
    end
  end)

  scope :unwatched_by, (lambda do |user|
    where.not(id: Course::Video::Submission.
                    by_user(user).
                    pluck('DISTINCT video_id'))
  end)

  def self.use_relative_model_naming?
    true
  end

  def to_partial_path
    'course/video/videos/video'.freeze
  end

  def initialize_duplicate(duplicator, other)
    copy_attributes(other, duplicator)
    self.course = duplicator.options[:target_course]
  end
end
