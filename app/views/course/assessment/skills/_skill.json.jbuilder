# frozen_string_literal: true

json.id skill.id
json.title skill.title
json.percentage @skills_service.percentage_mastery(skill)
json.grade @skills_service.grade(skill)
json.totalGrade skill.total_grade
