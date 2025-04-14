// New route to refresh a domain's DNS verification status
router.post('/refresh-dns/:domainId', auth, requireTeam, async (req, res) => {
  try {
    const { domainId } = req.params;
    const teamId = req.team.id;
    
    // Find the domain and verify it belongs to the team
    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
      include: { page: true }
    });
    
    if (!domain) {
      return res.status(404).json({ message: 'Domain not found' });
    }
    
    if (domain.page.teamId !== teamId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Check the DNS status
    const isDnsVerified = await checkDomainDNS(domain.domain, domain.recordType);
    
    // Update the domain status
    const updatedDomain = await prisma.domain.update({
      where: { id: domainId },
      data: { 
        dnsVerified: isDnsVerified,
        status: isDnsVerified ? 'ACTIVE' : 'PENDING'
      }
    });
    
    return res.json(updatedDomain);
  } catch (error) {
    console.error('Error refreshing domain DNS status:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}); 