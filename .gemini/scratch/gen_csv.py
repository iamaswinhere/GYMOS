import random
from datetime import datetime, timedelta

first_names = ["Amal", "Adwaith", "Achu", "Aswin", "Rahul", "Sneha", "Arjun", "Priya", "Karthik", "Anjali", "Suresh", "Meera", "Vikram", "Divya", "Rohan", "Sanjana", "Manoj", "Kavya", "Deepak", "Ritu"]
last_names = ["Raj", "Kumar", "Nair", "Menon", "Pillai", "Das", "Sharma", "Verma", "Gupta", "Reddy", "Iyer", "Singh", "Patel", "Joshi", "Khanna"]

plans = {
    "Student + PT": 2800,
    "Monthly GYM + PT": 3000,
    "Monthly GYM": 1000,
    "Student": 800
}

print("Name,Phone,Plan,Status,Amount,Expiry")

for _ in range(300):
    name = f"{random.choice(first_names)}{random.choice(last_names)}"
    phone = f"{random.randint(7000000000, 9999999999)}"
    plan = random.choice(list(plans.keys()))
    amount = plans[plan]
    
    # Random expiry date between last month and next 6 months
    days_offset = random.randint(-20, 180)
    expiry_date = (datetime.now() + timedelta(days=days_offset)).strftime("%Y-%m-%d")
    
    status = "active" if days_offset > 0 else "expired"
    
    print(f'"{name}","{phone}","{plan}","{status}",{amount},"{expiry_date}"')
