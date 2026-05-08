"use client"

import { useEffect, useState } from "react"

export default function PipelineDemo() {
  const [extractor, setExtractor] = useState<any>(null)
  const [designer, setDesigner] = useState<any>(null)
  const [evaluator, setEvaluator] = useState<any>(null)

  useEffect(() => {
    fetch("/demo/01_extractor.json")
      .then(res => res.json())
      .then(setExtractor)

    fetch("/demo/02_designer.json")
      .then(res => res.json())
      .then(setDesigner)

    fetch("/demo/03_evaluator.json")
      .then(res => res.json())
      .then(setEvaluator)
  }, [])

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">

      <h2 className="mb-12 text-center text-4xl font-bold">
        Pipeline Demo
      </h2>

      <div className="grid gap-8 md:grid-cols-3">

        {/* Extractor */}
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4">Extractor</h3>

          {extractor?.key_concepts?.map((c:any, i:number)=>(
            <div key={i} className="mb-3">
              <p className="font-semibold">{c.concept}</p>
              <p className="text-sm text-gray-600">
                {c.definition}
              </p>
            </div>
          ))}
        </div>

        {/* Designer */}
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4">Designer</h3>

          {designer?.learning_objectives?.map((o:string,i:number)=>(
            <p key={i} className="mb-2 text-gray-700">
              • {o}
            </p>
          ))}
        </div>

        {/* Evaluator */}
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4">Evaluator</h3>

          {evaluator?.quiz?.slice(0,3).map((q:any,i:number)=>(
            <div key={i} className="mb-4">
              <p className="font-semibold">{q.q}</p>
              <p className="text-sm text-gray-600">
                Respuesta: {q.answer}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}