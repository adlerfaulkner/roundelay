FactoryBot.define do
  factory :step do
    text { Faker::Lorem.sentence }
    position { 0 }
    recipe
  end
end
