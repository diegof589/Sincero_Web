"use client"

import { useMemo, useRef, useState } from "react"

type StepStatus = "idle" | "running" | "done"

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"

export default function Home() {
  const [extractor, setExtractor] = useState<any>(null)
  const [designer, setDesigner] = useState<any>(null)
  const [evaluator, setEvaluator] = useState<any>(null)
  const [finalData, setFinalData] = useState<any>(null)

  const [fileName, setFileName] = useState("")
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState("")

  const [steps, setSteps] = useState<{ name: string; status: StepStatus }[]>([
    { name: "Carga del PDF", status: "idle" },
    { name: "Extracción", status: "idle" },
    { name: "Planeación", status: "idle" },
    { name: "Evaluación", status: "idle" },
    { name: "Generación del quiz", status: "idle" },
  ])

  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const quizData = useMemo(() => {
    return finalData?.assessment?.quiz || evaluator?.quiz || []
  }, [finalData, evaluator])

  const score = useMemo(() => {
    if (!quizData?.length) return { correct: 0, total: 0, percent: 0 }

    const correct = quizData.filter(
      (q: any, index: number) => quizAnswers[index] === q.answer
    ).length

    return {
      correct,
      total: quizData.length,
      percent: Math.round((correct / quizData.length) * 100),
    }
  }, [quizAnswers, quizData])

  function resetSteps() {
    return [
      { name: "Carga del PDF", status: "idle" as StepStatus },
      { name: "Extracción", status: "idle" as StepStatus },
      { name: "Planeación", status: "idle" as StepStatus },
      { name: "Evaluación", status: "idle" as StepStatus },
      { name: "Generación del quiz", status: "idle" as StepStatus },
    ]
  }

  async function runRealPipeline(file: File) {
    setError("")
    setFileName(file.name)
    setIsProcessing(true)
    setShowResults(false)
    setQuizSubmitted(false)
    setQuizAnswers({})
    setExtractor(null)
    setDesigner(null)
    setEvaluator(null)
    setFinalData(null)

    let currentSteps = resetSteps()
    setSteps(currentSteps)
    setProgress(8)

    try {
      currentSteps[0].status = "done"
      currentSteps[1].status = "running"
      setSteps([...currentSteps])
      setProgress(20)

      const formData = new FormData()
      formData.append("pdf", file)
      formData.append("max_pages", "2")

      const response = await fetch(`${API_URL}/run_pipeline`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Error al ejecutar el pipeline")
      }

      currentSteps[1].status = "done"
      currentSteps[2].status = "done"
      currentSteps[3].status = "done"
      currentSteps[4].status = "done"
      setSteps([...currentSteps])
      setProgress(100)

      setExtractor(data.extractor || null)
      setDesigner(data.designer || null)
      setEvaluator(data.evaluator || null)
      setFinalData(data.final || null)
      setShowResults(true)
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error procesando el PDF")
      setProgress(0)
      setSteps(resetSteps())
    } finally {
      setIsProcessing(false)
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    runRealPipeline(file)
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    runRealPipeline(file)
  }

  function getStepClass(status: StepStatus) {
    if (status === "done") {
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    }

    if (status === "running") {
      return "border-cyan-200 bg-cyan-50 text-cyan-700"
    }

    return "border-gray-200 bg-white text-gray-500"
  }

  function getOptionClass(
    selected: boolean,
    submitted: boolean,
    isCorrectOption: boolean,
    isWrongSelected: boolean
  ) {
    if (submitted) {
      if (isCorrectOption) {
        return "border-emerald-300 bg-emerald-50 text-emerald-800"
      }

      if (isWrongSelected) {
        return "border-rose-300 bg-rose-50 text-rose-800"
      }

      return "border-gray-200 bg-white text-gray-700"
    }

    if (selected) {
      return "border-cyan-300 bg-cyan-50 text-cyan-800"
    }

    return "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
  }

  return (
    <main className="min-h-screen bg-[#f5fbfb] text-gray-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(28,191,181,0.22),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(15,118,110,0.18),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(45,212,191,0.16),transparent_30%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-5 w-fit rounded-full border border-[#b8ece8] bg-white/80 px-4 py-2 text-sm font-semibold text-[#0f766e] shadow-sm">
              Demo funcional del pipeline educativo
            </div>

            <h1 className="max-w-4xl text-5xl font-black tracking-tight text-gray-900 md:text-6xl">
              Convierte un PDF en una experiencia de aprendizaje más clara,
              visual y evaluable.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Sincero Consulting transforma documentos en contenido útil para
              extracción de conceptos, planeación instruccional, evaluación y
              quizzes interactivos listos para mostrar al cliente.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-2xl bg-[#19b8b0] px-6 py-4 text-base font-semibold text-white shadow-lg shadow-[#19b8b0]/25 transition hover:opacity-95"
              >
                Cargar PDF
              </button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white p-5 shadow-md shadow-slate-200/60">
                <p className="text-sm text-gray-500">Modelo</p>
                <p className="mt-2 text-xl font-bold text-gray-900">Google AI Estudio</p>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-md shadow-slate-200/60">
                <p className="text-sm text-gray-500">Salida</p>
                <p className="mt-2 text-xl font-bold text-gray-900">Insights + quiz</p>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-md shadow-slate-200/60">
                <p className="text-sm text-gray-500">Modo</p>
                <p className="mt-2 text-xl font-bold text-gray-900">Pipeline real</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-2xl shadow-slate-300/30 backdrop-blur">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className="rounded-[28px] border-2 border-dashed border-[#b8ece8] bg-[#f4fbfb] p-8 text-center transition hover:border-[#19b8b0] hover:bg-[#eefbfa]"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#dcf7f4] text-3xl font-bold text-[#0f766e]">
                PDF
              </div>

              <h2 className="mt-5 text-2xl font-bold text-gray-900">
                Arrastra tu PDF aquí
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Se enviará al backend, se leerá el contenido y se ejecutará el
                pipeline real con API de Google AI Estudio.
              </p>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 rounded-2xl bg-[#19b8b0] px-5 py-3 font-semibold text-white transition hover:opacity-95"
              >
                Seleccionar archivo
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={onFileChange}
              />

              {fileName && (
                <p className="mt-4 text-sm font-medium text-gray-700">
                  Archivo: {fileName}
                </p>
              )}
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-700">Estado del proceso</span>
                <span className="text-gray-500">{progress}%</span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-[#19b8b0] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-4 grid gap-3">
                {steps.map((step) => (
                  <div
                    key={step.name}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm ${getStepClass(
                      step.status
                    )}`}
                  >
                    <span className="font-medium">{step.name}</span>
                    <span>
                      {step.status === "done"
                        ? "Completo"
                        : step.status === "running"
                        ? "Procesando"
                        : "Pendiente"}
                    </span>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-8">
        <div className="grid gap-5 md:grid-cols-4">
          {[
            {
              title: "1. Cargar PDF",
              text: "Sube un archivo real al backend.",
            },
            {
              title: "2. Extraer contenido",
              text: "Mistral obtiene resumen y conceptos.",
            },
            {
              title: "3. Planear",
              text: "Se generan objetivos y plan de clase.",
            },
            {
              title: "4. Evaluar",
              text: "Se arma quiz y evaluación final.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl bg-white p-6 shadow-md shadow-slate-200/60"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dcf7f4] font-bold text-[#0f766e]">
                ✓
              </div>
              <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-8">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#0f766e]">
            Resultados
          </p>
          <h2 className="text-4xl font-black tracking-tight text-gray-900">
            Un dashboard de resultados
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Aquí se muestran los resultados procesado reales del PDF.
          </p>
        </div>

        {showResults ? (
          <div className="mt-10 grid gap-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/60">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h3 className="text-3xl font-bold text-gray-900">Extracción</h3>
                  <div className="rounded-full bg-[#dcf7f4] px-4 py-2 text-sm font-semibold text-[#0f766e]">
                    Resumen y conceptos
                  </div>
                </div>

                <p className="mb-2 text-sm text-gray-500">
                  {extractor?.title || "Sin título"}
                </p>

                <p className="mb-6 text-base leading-7 text-gray-700">
                  {extractor?.summary || "Sin resumen"}
                </p>

                <div className="max-h-[420px] space-y-4 overflow-y-auto pr-2">
                  {extractor?.key_concepts?.map((item: any, i: number) => (
                    <div key={i} className="rounded-2xl bg-[#f7fbfb] p-4">
                      <p className="text-lg font-semibold text-gray-800">
                        {item.concept}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {item.definition}
                      </p>
                      {item.evidence && (
                        <p className="mt-2 text-xs italic text-gray-500">
                          Evidencia: {item.evidence}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/60">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h3 className="text-3xl font-bold text-gray-900">Planeación</h3>
                  <div className="rounded-full bg-[#dcf7f4] px-4 py-2 text-sm font-semibold text-[#0f766e]">
                    Objetivos y clase
                  </div>
                </div>

                <div className="mb-6">
                  <p className="mb-3 text-lg font-semibold text-gray-700">
                    Objetivos
                  </p>

                  <div className="space-y-3">
                    {designer?.learning_objectives?.map((obj: string, i: number) => (
                      <div
                        key={i}
                        className="rounded-2xl bg-[#f7fbfb] p-4 text-sm leading-6 text-gray-700"
                      >
                        {obj}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-lg font-semibold text-gray-700">
                    Plan de clase
                  </p>

                  <div className="max-h-[360px] space-y-4 overflow-y-auto pr-2">
                    {designer?.lesson_plan?.map((lesson: any, i: number) => (
                      <div key={i} className="rounded-2xl bg-[#f7fbfb] p-4">
                        <p className="text-lg font-medium text-gray-800">
                          {lesson.topic}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          Duración: {lesson.duration_min} min
                        </p>

                        {lesson.activities?.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-semibold text-gray-700">
                              Actividades
                            </p>
                            <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                              {lesson.activities.map((act: string, j: number) => (
                                <li key={j}>{act}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {lesson.materials?.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-semibold text-gray-700">
                              Materiales
                            </p>
                            <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                              {lesson.materials.map((mat: string, j: number) => (
                                <li key={j}>{mat}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/60">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h3 className="text-3xl font-bold text-gray-900">Evaluación</h3>
                  <div className="rounded-full bg-[#dcf7f4] px-4 py-2 text-sm font-semibold text-[#0f766e]">
                    Vista académica
                  </div>
                </div>

                <p className="mb-6 text-base leading-7 text-gray-700">
                  {finalData?.summary || "Sin resumen final"}
                </p>

                <div className="grid gap-3">
                  <div className="rounded-2xl bg-[#f7fbfb] p-4 text-sm text-gray-700">
                    Conceptos detectados: {finalData?.key_concepts?.length || 0}
                  </div>
                  <div className="rounded-2xl bg-[#f7fbfb] p-4 text-sm text-gray-700">
                    Objetivos generados: {finalData?.learning_objectives?.length || 0}
                  </div>
                  <div className="rounded-2xl bg-[#f7fbfb] p-4 text-sm text-gray-700">
                    Preguntas de evaluación: {quizData?.length || 0}
                  </div>
                </div>

                <div className="mt-6 max-h-[320px] overflow-y-auto pr-2">
                  <p className="mb-3 text-lg font-semibold text-gray-700">
                    Conceptos finales
                  </p>

                  <div className="space-y-3">
                    {finalData?.key_concepts?.map((item: any, i: number) => (
                      <div key={i} className="rounded-2xl bg-[#f7fbfb] p-4">
                        <p className="font-semibold text-gray-800">{item.concept}</p>
                        <p className="mt-1 text-sm text-gray-600">
                          {item.definition}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/60">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h3 className="text-3xl font-bold text-gray-900">
                    Quiz interactivo
                  </h3>
                  <div className="rounded-full bg-[#dcf7f4] px-4 py-2 text-sm font-semibold text-[#0f766e]">
                    Selección múltiple
                  </div>
                </div>

                <div className="max-h-[700px] space-y-6 overflow-y-auto pr-2">
                  {quizData?.map((q: any, i: number) => {
                    const selected = quizAnswers[i]
                    const options = q.options || []
                    const correctAnswer = q.answer

                    return (
                      <div key={i} className="rounded-3xl border border-gray-200 p-5">
                        <p className="mb-4 text-lg font-bold text-gray-900">
                          {i + 1}. {q.q}
                        </p>

                        <div className="grid gap-3">
                          {options.map((option: string, j: number) => {
                            const isSelected = selected === option
                            const isCorrectOption = correctAnswer === option
                            const isWrongSelected =
                              quizSubmitted && isSelected && !isCorrectOption

                            return (
                              <button
                                key={j}
                                type="button"
                                onClick={() =>
                                  setQuizAnswers((prev) => ({
                                    ...prev,
                                    [i]: option,
                                  }))
                                }
                                className={`rounded-2xl border p-4 text-left text-sm transition ${getOptionClass(
                                  isSelected,
                                  quizSubmitted,
                                  isCorrectOption,
                                  isWrongSelected
                                )}`}
                              >
                                {option}
                              </button>
                            )
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className="mt-4">
                            <p
                              className={`text-sm font-medium ${
                                quizAnswers[i] === correctAnswer
                                  ? "text-emerald-700"
                                  : "text-rose-700"
                              }`}
                            >
                              {quizAnswers[i] === correctAnswer
                                ? "Respuesta correcta"
                                : "Respuesta incorrecta"}
                            </p>

                            {q.explanation && (
                              <p className="mt-2 text-sm leading-6 text-gray-600">
                                <span className="font-semibold">Explicación:</span>{" "}
                                {q.explanation}
                              </p>
                            )}

                            {q.difficulty && (
                              <p className="mt-1 text-xs text-gray-500">
                                Dificultad: {q.difficulty}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    className="rounded-2xl bg-[#19b8b0] px-5 py-3 font-semibold text-white transition hover:opacity-95"
                  >
                    Revisar respuestas
                  </button>

                  <button
                    onClick={() => {
                      setQuizAnswers({})
                      setQuizSubmitted(false)
                    }}
                    className="rounded-2xl border border-[#b8ece8] bg-white px-5 py-3 font-semibold text-[#0f766e] transition hover:bg-[#f0fbfa]"
                  >
                    Reiniciar quiz
                  </button>

                  {quizSubmitted && (
                    <div className="ml-auto rounded-2xl bg-[#f4fbfb] px-4 py-3 text-sm font-semibold text-gray-700">
                      Puntaje: {score.correct}/{score.total} ({score.percent}%)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-lg shadow-slate-200/60">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#dcf7f4] text-2xl font-bold text-[#0f766e]">
              +
            </div>

            <h3 className="mt-5 text-2xl font-bold text-gray-900">
              Carga un PDF para procesarlo
            </h3>

            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Aquí aparecerán la extracción, la planeación, la evaluación y el
              quiz generado a partir del documento real.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}