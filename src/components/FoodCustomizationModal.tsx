import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Minus, Check, Flame, Sparkles } from 'lucide-react';
import { SelectedCustomization } from '../types';

export const FoodCustomizationModal: React.FC = () => {
  const {
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    selectedFoodForCustomization,
    addToCart
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<SelectedCustomization[]>([]);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<string>('Medium');
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (selectedFoodForCustomization) {
      setQuantity(1);
      setSpecialInstructions('');
      setSelectedSpiceLevel(selectedFoodForCustomization.spiceLevel || 'Medium');

      // Pre-select required options
      const initial: SelectedCustomization[] = [];
      if (selectedFoodForCustomization.customizationGroups) {
        selectedFoodForCustomization.customizationGroups.forEach(group => {
          if (group.options.length > 0) {
            initial.push({
              groupId: group.id,
              groupTitle: group.title,
              optionId: group.options[0].id,
              optionName: group.options[0].name,
              price: group.options[0].price
            });
          }
        });
      }
      setSelectedCustomizations(initial);
    }
  }, [selectedFoodForCustomization]);

  if (!isCustomizationModalOpen || !selectedFoodForCustomization) return null;

  const handleOptionToggle = (
    groupId: string,
    groupTitle: string,
    optionId: string,
    optionName: string,
    price: number,
    required: boolean
  ) => {
    setSelectedCustomizations(prev => {
      if (required) {
        // Replace single choice in required group
        const filtered = prev.filter(c => c.groupId !== groupId);
        return [...filtered, { groupId, groupTitle, optionId, optionName, price }];
      } else {
        // Toggle optional addon
        const exists = prev.some(c => c.groupId === groupId && c.optionId === optionId);
        if (exists) {
          return prev.filter(c => !(c.groupId === groupId && c.optionId === optionId));
        } else {
          return [...prev, { groupId, groupTitle, optionId, optionName, price }];
        }
      }
    });
  };

  const customizationExtraTotal = selectedCustomizations.reduce((sum, c) => sum + c.price, 0);
  const unitPrice = selectedFoodForCustomization.price + customizationExtraTotal;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    addToCart(
      selectedFoodForCustomization,
      quantity,
      selectedCustomizations,
      selectedSpiceLevel,
      undefined,
      specialInstructions
    );
    setIsCustomizationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header Image */}
        <div className="relative h-44 shrink-0 overflow-hidden">
          <img
            src={selectedFoodForCustomization.image}
            alt={selectedFoodForCustomization.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => setIsCustomizationModalOpen(false)}
            className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/60 text-white backdrop-blur-md hover:bg-slate-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-bold">
            {selectedFoodForCustomization.restaurantName}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-slate-800 dark:text-slate-100">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                {selectedFoodForCustomization.name}
              </h3>
              <span className="font-black text-lg text-orange-600 dark:text-orange-400">
                ₹{selectedFoodForCustomization.price}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {selectedFoodForCustomization.description}
            </p>
          </div>

          {/* Spice Level Selector */}
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Choose Spice Level:
            </span>
            <div className="grid grid-cols-4 gap-2 text-xs font-bold">
              {['Mild', 'Medium', 'Hot', 'Extra Hot'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSelectedSpiceLevel(lvl)}
                  className={`py-2 px-1 rounded-xl border text-center transition ${
                    selectedSpiceLevel === lvl
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Customization Groups */}
          {selectedFoodForCustomization.customizationGroups?.map(group => (
            <div key={group.id} className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  {group.title}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {group.required ? 'REQUIRED' : 'OPTIONAL'}
                </span>
              </div>

              <div className="space-y-1.5">
                {group.options.map(opt => {
                  const isChecked = selectedCustomizations.some(
                    c => c.groupId === group.id && c.optionId === opt.id
                  );
                  return (
                    <button
                      key={opt.id}
                      onClick={() =>
                        handleOptionToggle(
                          group.id,
                          group.title,
                          opt.id,
                          opt.name,
                          opt.price,
                          group.required
                        )
                      }
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-medium transition ${
                        isChecked
                          ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-600 dark:text-orange-400 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isChecked
                              ? 'border-orange-500 bg-orange-500 text-white'
                              : 'border-slate-400'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span>{opt.name}</span>
                      </div>
                      {opt.price > 0 && <span>+₹{opt.price}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Special Instructions */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Special Instructions for Chef:
            </span>
            <input
              type="text"
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Less oil, extra cutlery, keep gravy separate"
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          
          {/* Quantity Controls */}
          <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-2xl shadow-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-5 rounded-2xl shadow-xl shadow-orange-500/25 transition flex items-center justify-between text-sm"
          >
            <span>Add Item to Cart</span>
            <span>₹{totalPrice}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
