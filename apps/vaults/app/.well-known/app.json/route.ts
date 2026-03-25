import { getApp } from 'syner/next'
export const GET = () => getApp('vaults')
export const dynamic = 'force-static'
