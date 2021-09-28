# frozen_string_literal: true
module Course::Assessment::Question::MultipleResponsesConcern
  extend ActiveSupport::Concern

  def switch_mcq_mrq_type(multiple_choice, unsubmit)
    case multiple_choice
    when 'true'
      @multiple_response_question.grading_scheme = :any_correct
    when 'false'
      @multiple_response_question.grading_scheme = :all_correct
    end
    @multiple_response_question.save!
    unsubmit_submissions unless unsubmit == 'false'
    @multiple_response_question.question.answers.destroy_all unless unsubmit == 'false'
  end

  def unsubmit_submissions
    @question_assessment.assessment.submissions.each do |submission|
      submission.update('unsubmit' => 'true') unless submission.attempting?
    end
  end
end
