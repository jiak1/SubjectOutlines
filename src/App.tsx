/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useMutation } from 'react-query'
import './App.css'
import exclamation from './exclamation.svg'

interface MutationVariables {
	code: string
	session: string
	year: string
}

const today = new Date()

function getCORSSafeURL(code: string, session: string, year: string) {
	return `https://allorigin.jackdonaldson.net/raw?url=${encodeURIComponent(
		`https://cis-admin-api.uts.edu.au/subject-outlines/index.cfm/PDFs?lastGenerated=true&lastGenerated=true&subjectCode=${code}&year=${year}&session=${session}&mode=standard&location=city#view=FitH`
	)}`
}

function useOutlineMutation() {
	return useMutation(
		['outline'],
		(variables: MutationVariables) =>
			axios
				.get(getCORSSafeURL(variables.code, variables.session, variables.year))
				.then((res) => res.data.data),
		{ retry: 0 }
	)
}

function getRecentYears() {
	let years = []
	const currentYear = today.getFullYear()
	for (let i = currentYear + 1; i > currentYear - 5; i--) {
		years.push(i)
	}
	return years
}

function App() {
	const [code, setCode] = useState('31927')
	const [session, setSession] = useState('AUT')
	const [year, setYear] = useState('2022')

	const outlineQuery = useOutlineMutation()

	const yearOptions = getRecentYears()

	useEffect(() => {
		outlineQuery.mutate({ code, session, year })
	}, [code, session, year])

	return (
		<div className="app pb-12 ">
			<div className="display shadow-2xl h-fit pb-4">
				<h1 className="p-6 pb-2 text-center text-2xl font-medium">
					UTS Subject Outline Retriever
				</h1>
				<div className="w-full h-full">
					<div className="w-4/5 ml-auto mr-auto block">
						<div className="block md:flex md:space-x-4">
							<div className="w-full md:w-1/2">
								<label className="block mb-2 text-sm font-medium text-gray-900 mt-4">
									Year
								</label>
								<select
									onChange={(e) => {
										setYear(e.target.value)
									}}
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 outline-none"
								>
									{yearOptions.map((year) => (
										<option selected={year === today.getFullYear()}>
											{year}
										</option>
									))}
								</select>
							</div>
							<div className="w-full md:w-1/2">
								<label className="block mb-2 text-sm font-medium text-gray-900 mt-4">
									Session
								</label>
								<select
									onChange={(e) => {
										console.log('setting session')
										setSession(e.target.value)
									}}
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 outline-none"
								>
									<option>AUT</option>
									<option>SPR</option>
									<option>SUM</option>
								</select>
							</div>
						</div>
						<label className="block mb-2 text-sm font-medium text-gray-900 mt-4">
							Subject Code
						</label>
						<div className="relative w-full">
							<input
								type="search"
								id="search-dropdown"
								className="transition-all block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:border-primary outline-none"
								placeholder="Search subject code..."
								value={code}
								onChange={(e) => {
									setCode(e.target.value)
								}}
								required
							/>
							<button
								type="submit"
								onClick={() => {
									outlineQuery.mutate({ code, session, year })
								}}
								className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white transition-all bg-primary rounded-r-lg border border-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-secondary"
							>
								<svg
									aria-hidden="true"
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									></path>
								</svg>
								<span className="sr-only">Search</span>
							</button>
						</div>
					</div>
					{code !== '' && outlineQuery.isLoading && (
						<div className="text-center mt-24">
							<div role="status">
								<svg
									className="inline mr-2 w-16 h-16 text-gray-200 animate-spin fill-primary"
									viewBox="0 0 100 101"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
										fill="currentColor"
									/>
									<path
										d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
										fill="currentFill"
									/>
								</svg>
							</div>
						</div>
					)}

					{code !== '' && outlineQuery.isSuccess && (
						<div className=" bg-dark rounded-xl p-4 m-4 mt-8 sm:mt-4">
							<iframe
								title="Subject Outline"
								className="w-full h-full min-h-[400px] md:min-h-[600px]"
								src={getCORSSafeURL(code, session, year)}
								onLoad={(e) => {}}
							/>
						</div>
					)}

					{code !== '' && outlineQuery.isError && (
						<div className="mt-8 p-6 w-4/5 ml-auto mr-auto block rounded-lg border border-gray-300">
							<img
								src={exclamation}
								className="ml-auto mr-auto block"
								width="60px"
								height="60px"
								alt="Alert"
							/>
							<h1 className="text-2xl text-center mt-4 font-medium text-primary">
								Subject Outline Cannot Be Found!
							</h1>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default App
