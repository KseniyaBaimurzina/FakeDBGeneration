from faker import Faker
import random

class Fake():
    faker: Faker

    def __init__(self,locale:str,seed:int) -> None:
        self.faker = Faker(locale)
        self.faker.seed_instance(seed)
        self.random = random.Random(seed)

    def get_random_locale_symbol(self):
        symbol = None
        if self.random.random() <0.5:
            word = self.faker.word()
            symbol = self.random.choice(list(word))
        else:
            symbol = str(self.random.randint(0,9))
        return symbol
