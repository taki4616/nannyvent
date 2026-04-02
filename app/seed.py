"""
Run once to populate the database with realistic sample users and posts.
Usage: python seed.py
"""
from datetime import datetime, timedelta
from dotenv import load_dotenv
load_dotenv()

from app import create_app
from models import db, User, Post

NANNIES = [
    {
        "username": "Tamara_W",
        "email": "tamara.w@example.com",
        "password": "demo1234",
        "title": "Experienced Nanny — 8 Years with Infants & Toddlers",
        "content": (
            "Hi! I'm Tamara, a career nanny based in Atlanta, GA with 8 years of full-time experience. "
            "I specialize in newborns and toddlers and hold a current CPR/First Aid certification. "
            "I've worked with twins, children with sensory sensitivities, and families who travel frequently. "
            "I'm comfortable with sleep training, potty training, and light meal prep. "
            "I'm looking for a long-term position — ideally full-time, Monday–Friday. "
            "References from my last three families are available upon request."
        ),
        "days_ago": 2,
    },
    {
        "username": "Priya_Nanny",
        "email": "priya.n@example.com",
        "password": "demo1234",
        "title": "Early Childhood Education Grad Looking for Part-Time Role",
        "content": (
            "I recently graduated with a degree in Early Childhood Education and I'm passionate about "
            "play-based learning. I've nannied for three families over the past four years — two school-age "
            "kids and one toddler. I love doing arts and crafts, outdoor activities, and reading. "
            "I'm looking for 20–25 hrs/week, afternoons preferred. I have my own car and a clean record. "
            "Open to occasional overnights for families who need that flexibility."
        ),
        "days_ago": 5,
    },
    {
        "username": "Destiny_C",
        "email": "destiny.c@example.com",
        "password": "demo1234",
        "title": "Nanny & Household Manager — 10+ Years Experience",
        "content": (
            "I've spent the last decade working as both a nanny and a household manager for high-demand families. "
            "I'm organized, discreet, and great with routines. I handle everything from school pickups and "
            "activity scheduling to light cooking and household errands. "
            "I work best in structured households with children ages 4–12. "
            "Currently looking for a full-time position in the DC/MD/VA area. "
            "Salary expectations: $25–$32/hr based on responsibilities. NDA-comfortable."
        ),
        "days_ago": 8,
    },
    {
        "username": "Sofia_M",
        "email": "sofia.m@example.com",
        "password": "demo1234",
        "title": "Bilingual (Spanish/English) Nanny Seeking Family in NYC",
        "content": (
            "Hola! I'm Sofia, originally from Colombia, living in New York for 6 years. "
            "I'm fluent in Spanish and English and love helping kids grow up bilingual. "
            "I have 5 years of nanny experience, mostly with children under 5. "
            "I'm warm, patient, and structured — I'll keep the kids on a routine while also making "
            "room for creativity and outdoor time. "
            "Looking for a family in Manhattan or Brooklyn, full-time preferred."
        ),
        "days_ago": 12,
    },
    {
        "username": "Keisha_T",
        "email": "keisha.t@example.com",
        "password": "demo1234",
        "title": "Summer Nanny Available — Former Camp Counselor",
        "content": (
            "I'm a former camp counselor and part-time nanny looking for a summer position (June–August). "
            "I'm energetic, fun, and great at keeping kids engaged all day. "
            "I love swimming, hiking, board games, and cooking projects. "
            "I have experience with kids ages 5–14. Background check available. "
            "Based in Chicago — open to families in the suburbs too if transportation is provided."
        ),
        "days_ago": 3,
    },
]

PARENTS = [
    {
        "username": "The_Okafor_Family",
        "email": "okafor.family@example.com",
        "password": "demo1234",
        "title": "Seeking Full-Time Nanny for 2 Kids in Houston, TX",
        "content": (
            "We're a working family of four looking for a full-time nanny for our kids — Ella (3) and Marcus (6). "
            "Marcus is in school until 3pm so daytime focus is mainly Ella. Afternoons involve school pickup, "
            "snacks, and homework support. We value consistency and warmth above all else. "
            "Hours: Mon–Fri, 7:30am–5:30pm. Pay: $22–$26/hr depending on experience. "
            "We provide paid holidays, 2 weeks PTO, and a guaranteed weekly pay schedule. "
            "Must be comfortable with two dogs (they're friendly!)."
        ),
        "days_ago": 1,
    },
    {
        "username": "Kim_and_David_L",
        "email": "kdliang@example.com",
        "password": "demo1234",
        "title": "Part-Time Nanny Needed — Infant (5 months) in Boston",
        "content": (
            "We're first-time parents looking for a part-time nanny for our daughter Lily, currently 5 months old. "
            "We both work from home but need dedicated, professional childcare so we can focus. "
            "Hours: Tue/Wed/Thu, 8am–4pm. We're open to negotiating on days. "
            "We're looking for someone experienced with infants, ideally with CPR certification. "
            "Our home is calm and quiet. We follow an eat-play-sleep routine and would love someone "
            "who can support that. Pay: $20–$24/hr."
        ),
        "days_ago": 4,
    },
    {
        "username": "SingleDad_Ray",
        "email": "raymond.b@example.com",
        "password": "demo1234",
        "title": "Looking for a Reliable Nanny — Flexible Schedule",
        "content": (
            "I'm a single dad with two boys, ages 7 and 9. I work in healthcare so my schedule rotates. "
            "I need someone reliable who can adapt week to week — sometimes early mornings, sometimes evenings. "
            "The boys are active and funny. They love Legos, basketball, and anything outdoors. "
            "They don't need much managing, just a responsible adult presence and someone who genuinely likes kids. "
            "I'm looking for someone who wants to build a long-term relationship with our little family. "
            "Rate is negotiable — flexibility is worth something to me."
        ),
        "days_ago": 7,
    },
    {
        "username": "The_Vasquez_House",
        "email": "vasquez.family@example.com",
        "password": "demo1234",
        "title": "Nanny/Household Manager for Busy Family of 5 — LA Area",
        "content": (
            "We have three kids (ages 2, 5, and 8) and run two businesses from home. We need someone "
            "who can handle the kids and keep the household running smoothly. "
            "Duties include: school pickup, meals, light tidying, errands, and activity coordination. "
            "We're not looking for a babysitter — we need a true household partner. "
            "Full-time, Mon–Fri. Competitive salary ($28–$35/hr) plus benefits for the right person. "
            "Bilingual (Spanish) a huge plus. Live-out preferred but live-in considered."
        ),
        "days_ago": 10,
    },
    {
        "username": "Amara_and_Josh",
        "email": "amara.josh@example.com",
        "password": "demo1234",
        "title": "Seeking Nanny with Special Needs Experience — Chicago",
        "content": (
            "Our son Theo is 6 years old and is on the autism spectrum. He's sweet, curious, and loves trains. "
            "We're looking for a nanny who has experience working with neurodivergent children and can "
            "support his sensory needs and communication style. "
            "He receives ABA therapy 3x/week — the nanny would not need to provide therapy, but "
            "should understand how to reinforce positive behaviors throughout the day. "
            "Hours: Mon–Fri, 2pm–7pm. Pay: $26–$30/hr. We take great care of people who take great care of Theo."
        ),
        "days_ago": 6,
    },
]


def seed():
    app = create_app()
    with app.app_context():
        db.create_all()

        if Post.query.count() > 0:
            print("Database already has posts — skipping seed.")
            return

        print("Seeding database...")

        for data in NANNIES:
            if User.query.filter_by(email=data["email"]).first():
                continue
            user = User(username=data["username"], email=data["email"], role="nanny")
            user.set_password(data["password"])
            db.session.add(user)
            db.session.flush()
            post = Post(
                title=data["title"],
                content=data["content"],
                role="nanny",
                user_id=user.id,
                created_at=datetime.utcnow() - timedelta(days=data["days_ago"]),
            )
            db.session.add(post)

        for data in PARENTS:
            if User.query.filter_by(email=data["email"]).first():
                continue
            user = User(username=data["username"], email=data["email"], role="parent")
            user.set_password(data["password"])
            db.session.add(user)
            db.session.flush()
            post = Post(
                title=data["title"],
                content=data["content"],
                role="parent",
                user_id=user.id,
                created_at=datetime.utcnow() - timedelta(days=data["days_ago"]),
            )
            db.session.add(post)

        db.session.commit()
        print(f"Done — seeded {len(NANNIES)} nanny posts and {len(PARENTS)} parent posts.")


if __name__ == "__main__":
    seed()
