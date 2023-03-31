from typing import Callable
from pydantic import BaseModel
from uuid import UUID
from fake import Fake

class User(BaseModel):
    number: int
    name: str
    phone: str
    address: str
    id: UUID

    fake: Fake
    
    def data(self):
        return self.dict(exclude=("fake"))

    def create_mistakes(self,errors:float):
        probable_error = 0 if self.fake.random.random() < errors%1 else 1
        errors = int(errors) + probable_error
        while errors > 1:
            self.create_mistake()
            errors -=1

    def create_mistake(self):
        mistake_method: Callable = self.get_mistake_method()
        prop,value = self.get_property_to_change()
        setattr(self, prop, mistake_method(value))

    def delete_symbols_mistake(self,value:str):
        if len(value) == 1:
            return value
        index = self.fake.random.randint(0,len(value))
        return value[:index] + value[index+1:]

    def change_symbols_mistake(self,value:str):
        if len(value) == 1:
            return value
        index = self.fake.random.randint(0,len(value)-2)
        value = list(value)
        value[index],value[index+1] = value[index+1],value[index]
        return "".join(value)

    def add_symbols_mistake(self,value:str):
        random_symbol = self.fake.get_random_locale_symbol()
        index = self.fake.random.randint(0,len(value)-1)
        return value[:index+1] + random_symbol + value[index+1:]
        
    def get_property_to_change(self):
        props = ["address","name","phone"]
        prop = self.fake.random.choice(props)
        value = getattr(self,prop)
        return prop, value

    def get_mistake_method(self) -> Callable:
        mistake_methods = [self.delete_symbols_mistake,self.change_symbols_mistake,self.add_symbols_mistake]
        return self.fake.random.choice(mistake_methods)