# frozen_string_literal: true
require 'rails_helper'

RSpec.describe Course::StatisticsController, type: :controller do
  let(:instance) { Instance.default }

  with_tenant(:instance) do
    let(:course) { create(:course, :enrollable) }
    let(:course_user) { create(:course_user, course: course) }

    describe '#all_students' do
      subject { get :all_students, params: { course_id: course, user_id: course_user } }

      context 'when a Normal User visits the page' do
        let(:user) { create(:user) }
        before { sign_in(user) }
        it { expect { subject }.to raise_exception(CanCan::AccessDenied) }
      end

      context 'when a Course Student visits the page' do
        let(:user) { create(:course_student, course: course).user }
        before { sign_in(user) }
        it { expect { subject }.to raise_exception(CanCan::AccessDenied) }
      end

      context 'when a Course Teaching Assistant visits the page' do
        let(:user) { create(:course_teaching_assistant, course: course).user }
        before { sign_in(user) }
        it { expect(subject).to be_successful }
      end

      context 'when a Course Manager visits the page' do
        let(:user) { create(:course_manager, course: course).user }
        before { sign_in(user) }
        it { expect(subject).to be_successful }
      end

      context 'when a Course Observer visits the page' do
        let(:user) { create(:course_observer, course: course).user }
        before { sign_in(user) }
        it { expect(subject).to be_successful }
      end
    end

    describe '#my_students' do
      subject { get :my_students, params: { course_id: course, user_id: course_user } }

      context 'when a Normal User visits the page' do
        let(:user) { create(:user) }
        before { sign_in(user) }
        it { expect { subject }.to raise_exception(CanCan::AccessDenied) }
      end

      context 'when a Course Student visits the page' do
        let(:user) { create(:course_student, course: course).user }
        before { sign_in(user) }
        it { expect { subject }.to raise_exception(CanCan::AccessDenied) }
      end

      context 'when a Course Teaching Assistant without students visits the page' do
        let(:user) { create(:course_teaching_assistant, course: course).user }
        before { sign_in(user) }
        it { expect(subject).to redirect_to(action: :all_students) }
      end

      context 'when a Course Teaching Assistant with students visits the page' do
        let(:teaching_assistant) { create(:course_teaching_assistant, course: course) }
        let(:group) { create(:course_group, course: course) }
        let(:student) { create(:course_student, course: course) }

        before do
          create(:course_group_manager, group: group, course_user: teaching_assistant)
          create(:course_group_user, group: group, course_user: student)
          sign_in(teaching_assistant.user)
        end
        it { expect(subject).to be_successful }
      end

      context 'when a Course Manager without students visits the page' do
        let(:user) { create(:course_manager, course: course).user }
        before { sign_in(user) }
        it { expect(subject).to redirect_to(action: :all_students) }
      end

      context 'when a Course Manager with students visits the page' do
        let(:manager) { create(:course_manager, course: course) }
        let(:group) { create(:course_group, course: course) }
        let(:student) { create(:course_student, course: course) }

        before do
          create(:course_group_manager, group: group, course_user: manager)
          create(:course_group_user, group: group, course_user: student)
          sign_in(manager.user)
        end
        it { expect(subject).to be_successful }
      end

      context 'when a Course Observer without students visits the page' do
        let(:user) { create(:course_observer, course: course).user }
        before { sign_in(user) }
        it { expect(subject).to redirect_to(action: :all_students) }
      end

      context 'when a Course Observer with students visits the page' do
        let(:observer) { create(:course_observer, course: course) }
        let(:group) { create(:course_group, course: course) }
        let(:student) { create(:course_student, course: course) }

        before do
          create(:course_group_manager, group: group, course_user: observer)
          create(:course_group_user, group: group, course_user: student)
          sign_in(observer.user)
        end
        it { expect(subject).to be_successful }
      end
    end

    describe '#download' do
      subject do
        get :download, params: { course_id: course.id, user_id: course_user, only_my_students: false }
      end

      context 'when a Normal User tries to download' do
        let(:user) { create(:user) }
        before { sign_in(user) }
        it { expect { subject }.to raise_exception(CanCan::AccessDenied) }
      end

      context 'when a Course Student tries to download' do
        let(:user) { create(:course_student, course: course).user }
        before { sign_in(user) }
        it { expect { subject }.to raise_exception(CanCan::AccessDenied) }
      end

      context 'when a Course Teaching Assistant tries to download' do
        let(:user) { create(:course_teaching_assistant, course: course).user }
        before { sign_in(user) }
        it 'returns a html file' do
          subject
          expect(response.header['Content-Type']).to include('text/html')
          expect(response.status).to eq(302)
        end
      end

      context 'when a Course Manager tries to download' do
        let(:user) { create(:course_manager, course: course).user }
        before { sign_in(user) }
        it 'returns a html file' do
          subject
          expect(response.header['Content-Type']).to include('text/html')
          expect(response.status).to eq(302)
        end
      end

      context 'when a Course Observer tries to download' do
        let(:user) { create(:course_observer, course: course).user }
        before { sign_in(user) }
        it 'returns a html file' do
          subject
          expect(response.header['Content-Type']).to include('text/html')
          expect(response.status).to eq(302)
        end
      end
    end
  end
end
