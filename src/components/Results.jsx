
const Results = ({
    results
}) => {

    if (results.length === 0) {
        return null;
    }

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-[50vh]" id="results-table">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            De
                        </th>
                        <th scope="col" className="px-6 py-3">
                            A
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        results.map((result, index) => (

                            <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {result.from}
                                </th>
                                <td className="px-6 py-4">
                                    {result.to}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Results