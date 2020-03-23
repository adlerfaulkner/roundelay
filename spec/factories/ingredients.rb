FactoryBot.define do
  factory :ingredient do
    text { Faker::Lorem.sentence }
    position { 0 }
    recipe
  end
end
