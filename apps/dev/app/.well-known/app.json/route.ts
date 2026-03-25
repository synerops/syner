import { getApp } from 'syner/next'
export const GET = () => getApp('dev')
export const dynamic = 'force-static'
