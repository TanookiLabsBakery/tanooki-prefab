User.find_or_create_by!(email: "admin@example.com") do |user|
  user.first_name = "Admin"
  user.last_name = "User"
  user.password = "password123"
  user.user_role = "system_admin"
  user.user_status = "active"
  user.time_zone = "America/New_York"
end

User.find_or_create_by!(email: "user@example.com") do |user|
  user.first_name = "Test"
  user.last_name = "User"
  user.password = "password123"
  user.user_role = "default"
  user.user_status = "active"
  user.time_zone = "America/New_York"
end
