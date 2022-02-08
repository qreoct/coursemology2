class AllowMultipleCourseAssessmentSubmissions < ActiveRecord::Migration[6.0]
  def up
    add_column :course_assessment_submissions, :is_official_submission, :boolean, default: true
    add_column :course_assessment_submissions, :submission_type, :integer, default: 0, null: false
    add_reference :course_assessment_submissions, :unsubmitter, foreign_key: { to_table: :users }
    add_column :course_assessment_submissions, :unsubmitted_at, :datetime

    add_index :course_assessment_submissions, [:assessment_id, :creator_id], unique: true,
              name: 'unique_official_submission_assessment_id_and_creator_id',
              where: "is_official_submission = true"
    add_index :course_assessment_submissions, [:assessment_id, :creator_id, :submission_type], unique: true,
              name: 'unique_assessment_creator_and_submission_type_when_attempting',
              where: "workflow_state = 'attempting'"

    # Remove the original index from db/migrate/20160815141617_prevent_duplicate_submissions.rb
    remove_index :course_assessment_submissions, name: 'unique_assessment_id_and_creator_id'
  end

  def down
    add_index :course_assessment_submissions, [:assessment_id, :creator_id], unique: true,
                                               name: 'unique_assessment_id_and_creator_id'
    remove_index :course_assessment_submissions, name: 'unique_official_submission_assessment_id_and_creator_id'
    remove_index :course_assessment_submissions, name: 'unique_assessment_creator_and_submission_type_when_attempting'
    remove_column :course_assessment_submissions, :unsubmitted_at
    remove_reference :course_assessment_submissions, :unsubmitter
    remove_column :course_assessment_submissions, :submission_type
    remove_column :course_assessment_submissions, :is_official_submission
  end
end
