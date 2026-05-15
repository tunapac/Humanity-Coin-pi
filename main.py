from kivy.app import App
from kivy.uix.gridlayout import GridLayout
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.uix.scrollview import ScrollView

class HumaPortal(App):
    def build(self):
        root = GridLayout(cols=1, spacing=10, padding=20, size_hint_y=None)
        root.bind(minimum_height=root.setter('height'))

        # --- DNA / TDL HUB HEADER ---
        root.add_widget(Label(text="[b]TUNAPAC DNA / TDL HUB[/b]", markup=True, font_size='22sp'))
        root.add_widget(Button(text="Search .huma / .629 / .tunapac", size_hint_y=None, height=50))

        # --- THE FIRST 6 PRODUCTS ---
        root.add_widget(Label(text="SOVEREIGN PRODUCT LABS", font_size='18sp'))
        products = [
            "QFS 20022 ATM Lab", "Master CHIP Studio", 
            "Huma Streams Lab", "HumaQuantum IDE", 
            "Gemini-6.4 Canvas", "Huma//DNS Root"
        ]
        
        for product in products:
            root.add_widget(Button(text=product, size_hint_y=None, height=80))

        scroll = ScrollView(size_hint=(1, 1))
        scroll.add_widget(root)
        return scroll

if __name__ == '__main__':
    HumaPortal().run()
