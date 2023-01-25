//@ts-nocheck
import React from "react"
import NavBar from "../components/navbar"

export function Options({data}) {
    return (
        <main>
            <NavBar/>
            <div className="justify-center max-w-2xl m-auto">
                <h1 className="text-4xl font-bold">Configure</h1>
                <hr className="mb-2 h-2 bg-gray-900 border-0"/>
            </div>
        </main>
    )
}