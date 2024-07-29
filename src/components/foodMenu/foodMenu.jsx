import React from "react";
import "./foodMenu.css";
import "../../css/accordian.css";

export const FoodMenu = () => {
  const menuData = [
    {
      day: "Friday",
      meals: {
        Breakfast: "No breakfast",
        Lunch: "No lunch",
        Dinner: "Cheeseburger Soup (Choup), Chili",
      },
    },
    {
      day: "Saturday",
      meals: {
        Breakfast:
          "Sausage Gravy and Biscuits, Race Eggs, Cereal, Yogurt/Berries",
        Lunch: "Brats and Dogs, Cheeseburger Soup (Choup), Chili",
        Dinner: "Pulled Pork Sandwiches, Collards, Macaroni and Cheese, Salad",
      },
    },
    {
      day: "Sunday",
      meals: {
        Breakfast:
          "Sausage Gravy and Biscuits, Race Eggs, Cereal, Yogurt/Berries",
        Lunch: "Smoked Chicken, Cheeseburger Soup (Choup), Chili, Pulled Pork",
        Dinner: "Taco Bar",
      },
    },
    {
      day: "Monday",
      meals: {
        Breakfast: "Sausage Gravy and Biscuits, Race Eggs, Cereal",
        Lunch: "Any leftovers",
        Dinner: "No dinner, go home",
      },
    },
  ];

  return (
    <div className="container-fluid food">
      <h1 className="foodHeader">The Race Menu</h1>
      <div id="accordionExample" className="accordion">
        {menuData.map((item, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header">
              <button
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${index}`}
                aria-expanded="false"
                aria-controls={`collapse${index}`}
                className="accordion-button collapsed"
              >
                {item.day}
              </button>
            </h2>
            <div
              id={`collapse${index}`}
              data-bs-parent="#accordionExample"
              className="accordion-collapse collapse"
            >
              <div className="accordion-body">
                {Object.entries(item.meals).map(
                  ([meal, description], mealIndex) => (
                    <div key={mealIndex}>
                      <h3>{meal}</h3>
                      <p>{description}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
