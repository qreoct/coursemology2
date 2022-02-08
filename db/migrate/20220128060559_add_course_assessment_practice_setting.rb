class AddCourseAssessmentPracticeSetting < ActiveRecord::Migration[6.0]
  def change
    add_column :course_assessments, :allow_practice_attempts, :boolean, default: false
    add_column :course_assessments, :allow_practice_exp, :boolean, default: false
    add_column :course_assessments, :practice_max_retries, :integer, default: nil
  end
end
