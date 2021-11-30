# frozen_string_literal: true
# submissions_hash ||= @submissions.map { |s| [s.assessment_id.to_s + '_' + s.creator_id.to_s, s] }.to_h

json.assessments @assessments do |assessment|
  json.set! assessment.id do
    json.title assessment.title
    json.tab assessment.tab.title
    json.category assessment.tab.category.title
    json.maximumGrade assessment.maximum_grade.to_f
  end
end

json.courseUsers @course_users do |course_user|
  json.set! course_user.id do
    json.name course_user.name
    # json.path course_user_path(current_course, course_user)
    # json.phantom course_user.phantom?
    # json.submissions @assessments do |assessment|
    #   submission = submissions_hash[ assessment.id.to_s + '_' + course_user.user.id.to_s]
    #   json.array! [submission&.id]
      # json.array! [submission&.id, submission&.workflow_state, submission&.grade&.to_f, submission&.current_points_awarded]
      # if submission
      #   json.id submission.id
      #   json.workflowState submission.workflow_state
      #   json.grade submission.grade.to_f
      #   json.pointsAwarded submission.current_points_awarded
      # else
      #   json.workflowState 'unstarted'
      # end
    # end
  end
end
