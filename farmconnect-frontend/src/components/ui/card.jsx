export const Card = (p) => <div className={`border rounded shadow p-4 bg-white ${p.className}`}>{p.children}</div>
export const CardHeader = (p) => <div className="mb-4">{p.children}</div>
export const CardTitle = (p) => <h3 className="text-lg font-bold">{p.children}</h3>
export const CardContent = (p) => <div>{p.children}</div>
export const CardDescription = (p) => <p className="text-gray-500 text-sm">{p.children}</p>
