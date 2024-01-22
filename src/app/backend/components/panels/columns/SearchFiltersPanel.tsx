// 'use server'

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Layouts
import Panel from "@/src/app/backend/components/layouts/PanelLayout";

// Hooks & Classes
import { FilterClass } from "@/src/libraries/structures";
import { useToTitleCase } from "@/src/app/backend/hooks/useToConvert";

// Icons
import { ChevronDown, ChevronsUp, Option, ChevronsDown, RefreshCw, Search, Star, X } from "lucide-react";

const SearchFiltersPanel: React.FC = () => {
    const defaults = require("@/src/json/defaults.json");

    const min = 10;
    const max = 10000;

    const [formData, setFormData] = useState<FilterClass>(
        new FilterClass({
            sort: "Popularity",
            condition: "All",
            type: "All",
            range_start: 0,
            range_end: 0,
        })
    );

    const [isAscending, setIsAscending] = useState(false);
    const [isDescending, setIsDescending] = useState(false);

    const handleToggleAscending = () => {
        setIsAscending(!isAscending);
        setIsDescending(false);

        setFormData({ ...formData, sort_order: !isAscending ? "ascending" : "" });
    };

    const handleToggleDescending = () => {
        setIsDescending(!isDescending);
        setIsAscending(false);
        setFormData({ ...formData, sort_order: !isDescending ? "descending" : "" });
    };

    // Tags
    const [tagInput, setTagInput] = useState<string>("");
    const tagInputRef = useRef<HTMLInputElement>(null);
    const handleTagInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === " " || event.key === "Enter") {
            handleAddTag();
        }
    };

    const handleAddTag = () => {
        if (formData.tags?.length === 20) {
            alert("You can only add up to 20 tags.");
            return;
        }

        const trimmedTag = tagInput.trim().replace(/\s+/g, "");
        if (trimmedTag !== "" && !formData.tags?.includes(trimmedTag)) {
            setFormData({ ...formData, tags: [...formData.tags!, trimmedTag] });
            setTagInput("");
        }

        setTimeout(() => {
            if (tagInputRef.current) {
                tagInputRef.current.focus();
            }
        }, 0);
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData({ ...formData, tags: formData.tags?.filter((tag) => tag !== tagToRemove) });
    };

    useEffect(() => {
        if (tagInputRef.current) {
            tagInputRef.current.style.width = "auto"; // Reset width to auto for correct sizing
            tagInputRef.current.style.width = `${tagInputRef.current.scrollWidth}px`;
        }
    }, [tagInput]);

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        if (event.target.name === "tags") {
            setTagInput(event.target.value.replace(/\s+/g, ""));
            return;
        } else if (event.target.name === "open" || event.target.name === "owner") {
            setFormData({ ...formData, [event.target.name]: !formData[event.target.name as keyof FilterClass] });
            return;
        } else if (event.target.name.includes("min")) {
            setFormData({ ...formData, range_start: parseInt(event.target.value) });
            if (parseInt(event.target.value) > formData.range_end) {
                setFormData({ ...formData, range_end: parseInt(event.target.value) });
            }
        } else if (event.target.name.includes("max")) {
            setFormData({ ...formData, range_end: parseInt(event.target.value) });
            if (parseInt(event.target.value) < formData.range_start) {
                setFormData({ ...formData, range_start: parseInt(event.target.value) });
            }
        } else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    };

    const handleResetInput = () => {
        setFormData(
            new FilterClass({
                sort: "Popularity",
                condition: "All",
                type: "All",
                range_start: 0,
                range_end: 0,
            })
        );

        setIsAscending(false);
        setIsDescending(false);
    };

    return (
        <Panel classes="flex-col p-4 gap-4 z-[1]">
            <form action="/search" method="GET" className="flex flex-col gap-4">
                {/* Search user */}
                <div className="flex flex-row w-full items-center bg-gray-100 rounded-sm px-2 py-2 hover:bg-gray-200 transition-colors duration-200 border border-gray-200 h-7">
                    <div className="flex flex-row items-center gap">
                        <Search className="text-gray-500" size={12} strokeWidth={3} />
                        <input
                            className="w-full text-gray-800 leading-3 text-[0.625rem] font-light bg-transparent px-2 appearance-none"
                            name="username"
                            type="text"
                            placeholder="Look for anyone..."
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Sort results */}
                <div className="flex flex-col gap-2 w-full">
                    <label className="text-gray-800 text-[0.625rem] leading-3 font-regular">Sort results by</label>
                    <div className="flex flex-row gap-2 w-full">
                        {/* Sort order */}
                        <div className="flex flex-row w-full items-center bg-gray-100 rounded-sm px-2 hover:bg-gray-200 transition-colors duration-200 border border-gray-200 h-7">
                            <Star className="text-gray-800" size={12} strokeWidth={3} />
                            <select
                                name="sort"
                                value={formData.sort}
                                className="w-full text-gray-800 text-[0.625rem] leading-3 font-regular bg-transparent px-2 appearance-none cursor-pointer py-2"
                                onChange={handleInputChange}
                                required>
                                {defaults.search.sorts.map((method: string, index: React.Key | null | undefined) => (
                                    <option
                                        className="w-full text-gray-500 text-xs font-light bg-gray-100"
                                        key={index}
                                        value={method}>
                                        {useToTitleCase(method)}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="text-gray-800" size={12} strokeWidth={3} />
                        </div>

                        {/* Ascending */}
                        <input
                            type="checkbox"
                            id="asc"
                            onClick={handleToggleAscending}
                            name="ascending"
                            value={isAscending ? "true" : "false"}
                            hidden
                        />
                        <label
                            htmlFor="asc"
                            className={`flex flex-row items-center justify-center rounded-sm hover:bg-gray-200 transition-colors duration-200 border border-gray-200 h-7 w-11 cursor-pointer ${
                                isAscending ? "bg-gray-300" : "bg-gray-100"
                            }`}>
                            <ChevronsUp className="text-gray-800" size={10} strokeWidth={3} />
                        </label>

                        {/* Descending */}
                        {/* <input type="button" id="desc" className={`flex flex-row items-center justify-center  rounded-sm hover:bg-gray-200 transition-colors duration-200 border border-gray-200 h-7 w-11 ${isDescending ? "bg-gray-300" : "bg-gray-100"}`} onClick={handleToggleDescending} name="descending">
              <ChevronsDown className="text-gray-800" size={10} strokeWidth={3} />
            </input> */}
                        <input
                            type="checkbox"
                            id="desc"
                            onClick={handleToggleDescending}
                            name="descending"
                            value={isDescending ? "true" : "false"}
                            hidden
                        />
                        <label
                            htmlFor="desc"
                            className={`flex flex-row items-center justify-center rounded-sm hover:bg-gray-200 transition-colors duration-200 border border-gray-200 h-7 w-11 cursor-pointer ${
                                isDescending ? "bg-gray-300" : "bg-gray-100"
                            }`}>
                            <ChevronsDown className="text-gray-800" size={10} strokeWidth={3} />
                        </label>
                    </div>
                </div>

                {/* Filter results */}
                <div className="flex flex-col gap-2 w-full">
                    <label className="text-gray-800 text-[0.625rem] leading-3 font-regular">Filter results</label>

                    <div className="flex flex-row gap-2">
                        <div className="flex flex-row w-full items-center bg-gray-100 rounded-sm px-2 hover:bg-gray-200 transition-colors duration-200 border border-gray-200 h-7">
                            <Star className="text-gray-800" size={12} strokeWidth={3} />
                            <select
                                name="condition"
                                value={formData.condition}
                                className="w-full text-gray-800 text-[0.625rem] leading-3 font-regular bg-transparent px-2 appearance-none cursor-pointer py-2"
                                onChange={handleInputChange}
                                required>
                                {defaults.search.conditions.map(
                                    (condition: string, index: React.Key | null | undefined) => (
                                        <option
                                            className="w-full text-gray-500 text-xs font-light bg-gray-100"
                                            key={index}
                                            value={condition}>
                                            {useToTitleCase(condition)}
                                        </option>
                                    )
                                )}
                            </select>
                            <ChevronDown className="text-gray-800" size={12} strokeWidth={3} />
                        </div>

                        <div className="flex flex-row w-full items-center bg-gray-100 rounded-sm px-2 hover:bg-gray-200 transition-colors duration-200 border border-gray-200 h-7">
                            <Star className="text-gray-800" size={12} strokeWidth={3} />
                            <select
                                name="type"
                                value={formData.type}
                                className="w-full text-gray-800 text-[0.625rem] leading-3 font-regular bg-transparent px-2 appearance-none cursor-pointer py-2"
                                onChange={handleInputChange}
                                required>
                                {defaults.search.types.map((type: string, index: React.Key | null | undefined) => (
                                    <option
                                        className="w-full text-gray-500 text-xs font-light bg-gray-100"
                                        key={index}
                                        value={type}>
                                        {useToTitleCase(type)}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="text-gray-800" size={12} strokeWidth={3} />
                        </div>
                    </div>
                </div>

                {/* Filter by Price */}
                <div className="flex flex-col gap-2 w-full">
                    <label className="text-gray-800 text-[0.625rem] leading-3 font-regular">Filter by price</label>
                    <div className="flex flex-col gap-1">
                        {/* Minimum Slider */}
                        <div className="flex flex-row gap-2 items-center">
                            <div className="bg-gray-100 border border-gray-200 rounded-sm px-1.5 w-[4rem] py-[0.1rem] leading-3">
                                <input
                                    type="number"
                                    disabled
                                    min={min}
                                    max={formData.range_end}
                                    step={10}
                                    value={formData.range_start}
                                    onChange={handleInputChange}
                                    className="bg-transparent text-[0.625rem] font-light w-full pb-1"
                                />
                            </div>
                            <h6 className="text-gray-800 font-regular text-[0.625rem] leading-3">Min</h6>
                            <input
                                type="range"
                                name="min-slider"
                                min={min}
                                max={formData.range_end}
                                step={10}
                                value={formData.range_start}
                                onChange={handleInputChange}
                                className="w-full appearance-none cursor-pointer bg-gray-200 h-1 rounded-full"
                            />
                        </div>

                        {/* Maximum Slider */}
                        <div className="flex flex-row gap-2 items-center">
                            <input
                                type="range"
                                name="max-slider"
                                min={formData.range_start}
                                max={max}
                                step={10}
                                value={formData.range_end}
                                onChange={handleInputChange}
                                className="w-full appearance-none cursor-pointer bg-gray-200 h-1 rounded-full"
                            />
                            <h6 className="text-gray-800 font-regular text-[0.625rem] leading-3">Max</h6>
                            <div className="bg-gray-100 border border-gray-200 rounded-sm px-1.5 w-[4rem] py-[0.1rem] leading-3">
                                <input
                                    type="number"
                                    disabled
                                    min={formData.range_start}
                                    max={max}
                                    step={10}
                                    value={formData.range_end}
                                    onChange={handleInputChange}
                                    className="bg-transparent text-[0.625rem] leading-3 font-light w-full pb-1"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter by Tags */}
                <div className="flex flex-col gap-2 w-full">
                    <label className="text-gray-800 text-[0.625rem] leading-3 font-regular">Filter by tags</label>
                    <div className="flex flex-row flex-wrap gap-1">
                        {formData.tags?.map((tag, index) => (
                            <span
                                key={index}
                                onClick={() => handleRemoveTag(tag)}
                                className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full cursor-pointer text-[0.625rem] font-light items-center justify-center flex flex-row gap-1 hover:bg-gray-200 transition-colors duration-200 border border-gray-200 h-5">
                                {tag}
                                <X className="text-gray-800" size={8} strokeWidth={3} />
                            </span>
                        ))}
                        <input
                            type="text"
                            name="tags"
                            ref={tagInputRef}
                            value={tagInput}
                            onChange={handleInputChange}
                            onKeyDown={handleTagInputKeyPress}
                            placeholder="Type something"
                            className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-[0.625rem] font-light w-full border border-gray-200 hover:bg-gray-200 transition-colors duration-200 h-5"
                            maxLength={50}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex flex-row items-center justify-between w-full">
                        <div className="flex flex-row items-center gap-2">
                            <RefreshCw className="text-gray-800" size={10} strokeWidth={3} />
                            <h6 className="text-gray-800 text-[0.625rem] font-regular leading-4">Negotiable price</h6>
                        </div>
                        <input
                            name="open"
                            type="checkbox"
                            value={formData.open ? "true" : "false"}
                            checked={formData.open}
                            onChange={handleInputChange}
                            className="rounded px-2 cursor-pointer h-2.5"
                        />
                    </div>

                    <div className="flex flex-row items-center justify-between w-full">
                        <div className="flex flex-row items-center gap-2">
                            <Option className="text-gray-800" size={10} strokeWidth={3} />
                            <h6 className="text-gray-800 text-[0.625rem] font-regular leading-4">Posts you made</h6>
                        </div>
                        <input
                            name="owner"
                            type="checkbox"
                            value={formData.owner ? "true" : "false"}
                            checked={formData.owner}
                            onChange={handleInputChange}
                            className="rounded px-2 cursor-pointer h-2.5"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <button
                        type="submit"
                        className="text-[0.625rem] font-light bg-slate-900 hover:bg-slate-800 text-violet-300 rounded-sm transition-colors duration-200">
                        Apply filters
                    </button>
                    <button
                        className="text-[0.625rem] font-light bg-gray-100 hover:bg-gray-300 text-black border border-gray-200 rounded-sm transition-colors duration-200"
                        onClick={handleResetInput}>
                        Clear filters
                    </button>
                </div>
            </form>
        </Panel>
    );
};

export default SearchFiltersPanel;
