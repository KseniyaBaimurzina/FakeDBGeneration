from faker import Faker
import random

class Fake():
    faker = Faker()

    def get_random_locale_symbol(self):
        symbol = None
        if random.random() <0.5:
            word = self.faker.word()
            symbol = random.choice(list(word))
        else:
            symbol = str(random.randint(0,9))
        return symbol
        # return word[random.randint(0,len(word)-1)]
    
    def update_faker(self,locale:str,seed:int):
        Faker.seed(seed)
        self.faker = Faker(locale)
        random.seed(seed)
    
fake = Fake()
